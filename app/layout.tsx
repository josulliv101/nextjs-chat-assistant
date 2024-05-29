import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import '@/app/globals.css'
import { cn, nanoid } from '@/lib/utils'

import '@/app/globals.css'

import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { ClientApiProvider } from './ClientApiProvider'
import FoobarMarker from '@/components/FoobarMarker'
import { MapContextProvider } from '@/components/MapContext'

import fetchPlaces from '@/lib/chat/fetchPlaces'
import { cookies } from 'next/headers'
import MapBM from './map/[[...placeIds]]/MapBM'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Blue Mushroom`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default async function RootLayout({
  children,
  mapChildren,
  params
}: {
  children: React.ReactNode
  mapChildren: React.ReactNode
  params: any
}) {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  console.log('session', session)
  const cookieStore = cookies()
  const pathname = cookieStore.get('pathname')

  const placeId = pathname?.value.split('/').slice(-1)[0]

  const places = await fetchPlaces([placeId || ''])
  const place = places[0]
  const name = place?.fields?.displayName?.mapValue?.fields?.text.stringValue
  const lat = place?.fields?.location?.mapValue?.fields?.latitude?.doubleValue
  const lng = place?.fields?.location?.mapValue?.fields?.longitude?.doubleValue
  const description =
    place?.fields?.generativeSummary?.mapValue?.fields?.description?.mapValue
      ?.fields?.text.stringValue

  let marker: any =
    placeId && lat && lng && name ? { lat, lng, name, id: placeId } : null
  if (!marker) {
    try {
      let geo = JSON.parse(cookieStore.get('geo')?.value || '{}')
      if (geo.latitude && geo.longitude) {
        marker = {
          id: 'user-geo',
          lat: Number(geo.latitude),
          lng: Number(geo.longitude),
          name: 'User geo'
        }
      }
    } catch (err) {}
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Toaster position="top-center" />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientApiProvider
            apiKey={process.env.GOOGLE_MAPS_API_KEY as string}
            libraries={['marker']}
          >
            <MapContextProvider>
              <div className="flex flex-col min-h-screen">
                <Header />

                <main className="grid grid-cols-12 gap-0 flex-1 bg-muted/50">
                  <aside className="w-full col-span-8 ">
                    <AI
                      initialAIState={{
                        chatId: id,
                        messages: [],
                        markers: marker ? [marker] : [],
                        foo: ''
                      }}
                    >
                      <MapBM>{mapChildren}</MapBM>
                      <Chat
                        id={id}
                        session={session}
                        missingKeys={missingKeys}
                      />
                      <div>{children}</div>
                    </AI>
                  </aside>
                </main>
              </div>
              <TailwindIndicator />
            </MapContextProvider>
          </ClientApiProvider>
        </Providers>
      </body>
    </html>
  )
}
