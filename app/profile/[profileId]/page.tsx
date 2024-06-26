import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { AdvancedMarker, Map, Marker, Pin } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import fetchPlaces from '@/lib/chat/fetchPlaces'

export default async function Page({ params: { profileId } }: any) {
  const places = await fetchPlaces([profileId])
  const place = places?.[0]
  const name = place?.fields?.displayName?.mapValue?.fields?.text.stringValue

  const description =
    place?.fields?.generativeSummary?.mapValue?.fields?.description?.mapValue
      ?.fields?.text.stringValue
  return (
    <>
      <div className="mt-8 px-12 bg-blue-50 flex gap-8 items-start">
        <div className="w-48 rounded-md">
          <Image
            src={`/${profileId}-logo.jpg`}
            alt=""
            width="200"
            height="200"
            className="object-cover w-48 h-48 rounded-md min-w-48"
          />
        </div>
        <div>
          <h2>{name}</h2>
          <p className=" h-[800px]">{description}</p>
        </div>
      </div>
    </>
  )
}
