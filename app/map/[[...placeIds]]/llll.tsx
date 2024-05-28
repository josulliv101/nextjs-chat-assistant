import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
// import '@/app/globals.css'
import { cn, nanoid } from '@/lib/utils'
import MapBM from './MapBM'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Recommendations',
    template: `%s - Blue Mushroom AI Chatbot`
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  return (
    <>
      <AI initialAIState={{ chatId: id, messages: [], markers: [], foo: '' }}>
        <MapBM />
        <Chat id={id} session={session} missingKeys={missingKeys} />
        {children}
      </AI>
    </>
  )
}
