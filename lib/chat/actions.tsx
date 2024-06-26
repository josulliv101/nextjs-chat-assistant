import 'server-only'
import Image from 'next/image'
import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue,
  StreamableValue,
  readStreamableValue
} from 'ai/rsc'

import { openai } from '@ai-sdk/openai'
import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Marker, Message } from '@/lib/types'
import { auth } from '@/auth'
import { KnownFor, RedirectOnClient } from '@/components/known-for'
import MapPosition from '@/components/MapPosition'
import fetchPlaces from './fetchPlaces'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const geoUser = aiState.get().markers.find(m => m.id === 'user-geo')

  const geoCustomMessage = geoUser
    ? `The user is from this general area - it is not exact so do not make specific reference to it...but use it to help determine where to search for recommendations: ${JSON.stringify(geoUser)}`
    : ''

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <SpinnerMessage />,
    system: `\
    You are a restaurant recommendation & conversation bot and you help users locate good places to eat that matches what they are looking for, step by step.

    Any time the user mentions the word directory, call the getRedirectUser tool with "/directory" as the pathname.
    
    ${geoCustomMessage}
    `,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    toolChoice: 'required',
    tools: {
      //   listStocks: {
      //     description: 'List three imaginary stocks that are trending.',
      //     parameters: z.object({
      //       stocks: z.array(
      //         z.object({
      //           symbol: z.string().describe('The symbol of the stock'),
      //           price: z.number().describe('The price of the stock'),
      //           delta: z.number().describe('The change in price of the stock')
      //         })
      //       )
      //     }),

      //     generate: async function* ({ stocks }) {
      //       yield (
      //         <BotCard>
      //           <StocksSkeleton />
      //         </BotCard>
      //       )

      //       await sleep(1000)

      //       const toolCallId = nanoid()

      //       aiState.done({
      //         ...aiState.get(),
      //         foo: 'bar',
      //         messages: [
      //           ...aiState.get().messages,
      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: [
      //               {
      //                 type: 'tool-call',
      //                 toolName: 'listStocks',
      //                 toolCallId,
      //                 args: { stocks }
      //               }
      //             ]
      //           },
      //           {
      //             id: nanoid(),
      //             role: 'tool',
      //             content: [
      //               {
      //                 type: 'tool-result',
      //                 toolName: 'listStocks',
      //                 toolCallId,
      //                 result: stocks
      //               }
      //             ]
      //           }
      //         ]
      //       })

      //       return (
      //         <BotCard>
      //           <Stocks props={stocks} />
      //         </BotCard>
      //       )
      //     }
      //   },
      //   showStockPrice: {
      //     description:
      //       'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
      //     parameters: z.object({
      //       symbol: z
      //         .string()
      //         .describe(
      //           'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
      //         ),
      //       price: z.number().describe('The price of the stock.'),
      //       delta: z.number().describe('The change in price of the stock')
      //     }),
      //     generate: async function* ({ symbol, price, delta }) {
      //       yield (
      //         <BotCard>
      //           <StockSkeleton />
      //         </BotCard>
      //       )

      //       await sleep(1000)

      //       const toolCallId = nanoid()

      //       aiState.done({
      //         ...aiState.get(),
      //         messages: [
      //           ...aiState.get().messages,
      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: [
      //               {
      //                 type: 'tool-call',
      //                 toolName: 'showStockPrice',
      //                 toolCallId,
      //                 args: { symbol, price, delta }
      //               }
      //             ]
      //           },
      //           {
      //             id: nanoid(),
      //             role: 'tool',
      //             content: [
      //               {
      //                 type: 'tool-result',
      //                 toolName: 'showStockPrice',
      //                 toolCallId,
      //                 result: { symbol, price, delta }
      //               }
      //             ]
      //           }
      //         ]
      //       })

      //       return (
      //         <BotCard>
      //           <Stock props={{ symbol, price, delta }} />
      //         </BotCard>
      //       )
      //     }
      //   },
      //   showStockPurchase: {
      //     description:
      //       'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
      //     parameters: z.object({
      //       symbol: z
      //         .string()
      //         .describe(
      //           'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
      //         ),
      //       price: z.number().describe('The price of the stock.'),
      //       numberOfShares: z
      //         .number()
      //         .describe(
      //           'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
      //         )
      //     }),
      //     generate: async function* ({ symbol, price, numberOfShares = 100 }) {
      //       const toolCallId = nanoid()

      //       if (numberOfShares <= 0 || numberOfShares > 1000) {
      //         aiState.done({
      //           ...aiState.get(),
      //           messages: [
      //             ...aiState.get().messages,
      //             {
      //               id: nanoid(),
      //               role: 'assistant',
      //               content: [
      //                 {
      //                   type: 'tool-call',
      //                   toolName: 'showStockPurchase',
      //                   toolCallId,
      //                   args: { symbol, price, numberOfShares }
      //                 }
      //               ]
      //             },
      //             {
      //               id: nanoid(),
      //               role: 'tool',
      //               content: [
      //                 {
      //                   type: 'tool-result',
      //                   toolName: 'showStockPurchase',
      //                   toolCallId,
      //                   result: {
      //                     symbol,
      //                     price,
      //                     numberOfShares,
      //                     status: 'expired'
      //                   }
      //                 }
      //               ]
      //             },
      //             {
      //               id: nanoid(),
      //               role: 'system',
      //               content: `[User has selected an invalid amount]`
      //             }
      //           ]
      //         })

      //         return <BotMessage content={'Invalid amount'} />
      //       } else {
      //         aiState.done({
      //           ...aiState.get(),
      //           messages: [
      //             ...aiState.get().messages,
      //             {
      //               id: nanoid(),
      //               role: 'assistant',
      //               content: [
      //                 {
      //                   type: 'tool-call',
      //                   toolName: 'showStockPurchase',
      //                   toolCallId,
      //                   args: { symbol, price, numberOfShares }
      //                 }
      //               ]
      //             },
      //             {
      //               id: nanoid(),
      //               role: 'tool',
      //               content: [
      //                 {
      //                   type: 'tool-result',
      //                   toolName: 'showStockPurchase',
      //                   toolCallId,
      //                   result: {
      //                     symbol,
      //                     price,
      //                     numberOfShares
      //                   }
      //                 }
      //               ]
      //             }
      //           ]
      //         })

      //         return (
      //           <BotCard>
      //             <Purchase
      //               props={{
      //                 numberOfShares,
      //                 symbol,
      //                 price: +price,
      //                 status: 'requires_action'
      //               }}
      //             />
      //           </BotCard>
      //         )
      //       }
      //     }
      //   },
      //   getEvents: {
      //     description:
      //       'List funny imaginary events between user highlighted dates that describe stock activity.',
      //     parameters: z.object({
      //       events: z.array(
      //         z.object({
      //           date: z
      //             .string()
      //             .describe('The date of the event, in ISO-8601 format'),
      //           headline: z.string().describe('The headline of the event'),
      //           description: z.string().describe('The description of the event')
      //         })
      //       )
      //     }),
      //     generate: async function* ({ events }) {
      //       yield (
      //         <BotCard>
      //           <EventsSkeleton />
      //         </BotCard>
      //       )

      //       await sleep(1000)

      //       const toolCallId = nanoid()

      //       aiState.done({
      //         ...aiState.get(),
      //         messages: [
      //           ...aiState.get().messages,
      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: [
      //               {
      //                 type: 'tool-call',
      //                 toolName: 'getEvents',
      //                 toolCallId,
      //                 args: { events }
      //               }
      //             ]
      //           },
      //           {
      //             id: nanoid(),
      //             role: 'tool',
      //             content: [
      //               {
      //                 type: 'tool-result',
      //                 toolName: 'getEvents',
      //                 toolCallId,
      //                 result: events
      //               }
      //             ]
      //           }
      //         ]
      //       })

      //       return (
      //         <BotCard>
      //           <Events props={events} />
      //         </BotCard>
      //       )
      //     }
      //   },
      redirectUser: {
        description: 'Redirect the user to a page of content.',
        parameters: z.object({
          pathname: z
            .string()
            .describe(
              'where to forward a user on to a new url for more content.'
            )
          // symbol: z
          //   .string()
          //   .describe(
          //     'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
          //   ),
          // price: z.number().describe('The price of the stock.'),
          // delta: z.number().describe('The change in price of the stock')
        }),
        generate: async function* ({ pathname = '' }) {
          yield <SpinnerMessage />

          await sleep(1000)

          yield (
            <BotCard>
              <BotMessage content={"I'll forward you to the directory."} />
            </BotCard>
          )

          await sleep(1000)

          yield (
            <>
              <BotCard>
                <BotMessage content={"I'm here if you have any questions 😊"} />
              </BotCard>
            </>
          )
          await sleep(1000)
          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            markers: [],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getRedirectUser',
                    toolCallId,
                    args: { pathname }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getRedirectUser',
                    toolCallId,
                    result: { pathname }
                  }
                ]
              }
            ]
          })

          return (
            <>
              <BotCard>
                <BotMessage content={"Here's some additional nav links."} />
              </BotCard>
              <div className="flex gap-2 mt-2">
                {['the-bancroft', 'row-34', 'smith-wollensky-burlington'].map(
                  id => (
                    <Button key={id} size="sm" asChild>
                      <Link href={`/map/${id}`}>{id}</Link>
                    </Button>
                  )
                )}
              </div>
              <RedirectOnClient pathname={pathname} />
            </>
          )
        }
      },
      getRecommendations: {
        description: 'Get recommendations for hot stocks.',
        parameters: z.object({
          placeIds: z
            .array(z.string())
            .describe(
              'An array of the stocks to look up - valid strings are "row-34", "smith-wollensky-burlington" & "the-bancroft"'
            )
          // symbol: z
          //   .string()
          //   .describe(
          //     'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
          //   ),
          // price: z.number().describe('The price of the stock.'),
          // delta: z.number().describe('The change in price of the stock')
        }),
        generate: async function* ({ placeIds = [] }) {
          yield <SystemMessage>Analyzing...</SystemMessage>

          // await sleep(2000)
          const placesList = await fetchPlaces(placeIds)
          console.log('getRecommendations/placeIds', placeIds)

          const names = placesList?.map(
            place =>
              place?.fields?.displayName?.mapValue?.fields?.text.stringValue
          )

          const markers = placesList?.map((place, index) => {
            const id = placeIds[index]
            const name =
              place?.fields?.displayName?.mapValue?.fields?.text.stringValue
            const lat =
              place?.fields?.location?.mapValue?.fields?.latitude?.doubleValue
            const lng =
              place?.fields?.location?.mapValue?.fields?.longitude?.doubleValue
            return { id, lat, lng, name }
          })

          yield <SystemMessage>Calling tool...</SystemMessage>

          // await sleep(2000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            markers: [...markers],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getRecommendations',
                    toolCallId,
                    args: { placeIds }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getRecommendations',
                    toolCallId,
                    result: { markers }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'assistant',
                content: 'Enjoy!'
              }
            ]
          })

          return (
            <>
              <div className="flex justify-between gap-4 mb-8">
                {markers.map(marker => (
                  <div key={marker.id} className="col-span-1">
                    <Image
                      width="200"
                      height="200"
                      className="w-1/3 h-auto object-cover"
                      alt={marker.name}
                      src={`/${marker.id}-logo.jpg`}
                    />
                  </div>
                ))}
              </div>
              <BotCard>
                <BotMessage content={'Check out these results.'} />
              </BotCard>
              <RedirectOnClient pathname={`/map/${placeIds.join('/')}`} />
            </>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
  foo?: string
  markers: Marker[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: {
    chatId: nanoid(),
    messages: [],
    markers: [],
    foo: 'loading'
  },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'listStocks' ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                {/* @ts-expect-error */}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPrice' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPurchase' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'getRedirectUser' ? (
              <BotCard>
                <div>Joe BIRD</div>
              </BotCard>
            ) : tool.toolName === 'getRecommendations' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Events props={tool.result} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}
