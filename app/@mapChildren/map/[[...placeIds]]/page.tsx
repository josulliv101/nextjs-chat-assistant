import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Marker, Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import fetchPlaces from '@/lib/chat/fetchPlaces'
import { TooltipPortal } from '@radix-ui/react-tooltip'

export default async function Page({ params: { placeIds } }: any) {
  const placeId = Array.isArray(placeIds) && placeIds.length ? placeIds[0] : ''
  const places = placeId ? await fetchPlaces([placeId]) : []
  const place = places?.[0]
  const name = place?.fields?.displayName?.mapValue?.fields?.text.stringValue
  const lat = place?.fields?.location?.mapValue?.fields?.latitude?.doubleValue
  const lng = place?.fields?.location?.mapValue?.fields?.longitude?.doubleValue
  const description =
    place?.fields?.generativeSummary?.mapValue?.fields?.description?.mapValue
      ?.fields?.text.stringValue

  const marker: Marker = { lat, lng, name, id: placeId }
  const handleClick = () => console.log(name)

  if (!marker || !marker.lat || !marker.lng) {
    return null
  }

  return (
    <>
      <FoobarMarker
        id={placeId}
        key={JSON.stringify(marker)}
        position={marker}
        clickable={true}
        // onClick={handleClick}
        title={marker?.name || 'unknown'}
      >
        <div className="relative z-[9999] rounded-full bg-blue-500 border-4 border-white size-8 animate-in"></div>
      </FoobarMarker>
    </>
  )
}
