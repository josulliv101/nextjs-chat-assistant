import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import Image from 'next/image'
import fetchPlaces from '@/lib/chat/fetchPlaces'

export default async function Page({ params: { placeIds } }: any) {
  const places = await fetchPlaces(placeIds)
  const place = places?.[0]
  const name = place?.fields?.displayName?.mapValue?.fields?.text.stringValue

  const description =
    place?.fields?.generativeSummary?.mapValue?.fields?.description?.mapValue
      ?.fields?.text.stringValue

  if (!placeIds || !placeIds.length) {
    return null
  }

  return (
    <div className="bg-gray-200 h-full px-4 py-3 lg:px-8 lg:py-6">
      <Image
        src={`/${placeIds[0]}-logo.jpg`}
        alt={name}
        width="240"
        height="240"
        className="border object-cover w-full h-auto rounded-md"
      />
    </div>
  )
}
