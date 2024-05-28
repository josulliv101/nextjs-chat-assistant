import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { ClientApiProvider } from './ClientApiProvider'
import FoobarMarker from '@/components/FoobarMarker'
import { MapContextProvider } from '@/components/MapContext'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`
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

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
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
                  <aside className="w-full col-span-8">{children}</aside>
                  <aside className="hidden min-w-32 col-span-4 bg-gray-100 px-8 py-6"></aside>
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
