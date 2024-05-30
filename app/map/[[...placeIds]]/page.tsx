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
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-12 px-4 py-3 lg:px-8 lg:py-6">
              <div>
                <h2 className="font-semibold text-xl mb-2">{name}</h2>
                <p className=" min-h-[100px] text-lg">{description}</p>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
