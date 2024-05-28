import { SidebarDesktop } from '@/components/sidebar-desktop'
import FoobarMap from '@/components/foobar-map'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex">
      <SidebarDesktop />

      <FoobarMap>{children}</FoobarMap>
    </div>
  )
}
