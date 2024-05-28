import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AdvancedMarker, Map, Marker, Pin } from '@vis.gl/react-google-maps'

import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import MapBM from './MapBM'

export default async function Page({}: any) {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  return (
    <>
      <AI initialAIState={{ chatId: id, messages: [], markers: [], foo: '' }}>
        <MapBM />
        <Chat id={id} session={session} missingKeys={missingKeys} />
      </AI>
    </>
  )
}
