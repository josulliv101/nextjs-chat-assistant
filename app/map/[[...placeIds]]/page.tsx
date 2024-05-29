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
import fetchPlaces from '@/lib/chat/fetchPlaces'
import Image from 'next/image'

export default async function Page({ params: { placeIds } }: any) {
  const foobarPlaces =
    Array.isArray(placeIds) && placeIds.length ? placeIds : [placeIds]
  const places = await fetchPlaces(foobarPlaces)

  return (
    <>
      {places.map((place, index) => {
        const name =
          place?.fields?.displayName?.mapValue?.fields?.text.stringValue

        const description =
          place?.fields?.generativeSummary?.mapValue?.fields?.description
            ?.mapValue?.fields?.text.stringValue

        return (
          <div
            key={name}
            className="mt-8 px-12 rounded-md flex gap-8 items-start"
          >
            <Image
              className="aspect-square min-w-48 rounded-md"
              alt={name}
              width="200"
              height="200"
              src={`/${foobarPlaces[index]}-logo.jpg`}
            />
            <div>
              <h2 className="font-semibold text-xl mb-2">{name}</h2>
              <p className=" min-h-[100px]">{description}</p>
            </div>
          </div>
        )
      })}
    </>
  )
}
