import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AdvancedMarker, Map, Marker, Pin } from '@vis.gl/react-google-maps'

import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import fetchPlaces from '@/lib/chat/fetchPlaces'

export default async function Page({ params: { placeIds } }: any) {
  const placeId = Array.isArray(placeIds) && placeIds.length ? placeIds[0] : ''
  const places = await fetchPlaces([placeId])
  const place = places[0]
  const name = place?.fields?.displayName?.mapValue?.fields?.text.stringValue

  const description =
    place?.fields?.generativeSummary?.mapValue?.fields?.description?.mapValue
      ?.fields?.text.stringValue
  return (
    <>
      <div className="mt-8 px-12">
        <h2 className="text-2xl font-semibold">{name}</h2>
      </div>
    </>
  )
}
