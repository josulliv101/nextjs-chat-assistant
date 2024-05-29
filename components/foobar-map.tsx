'use client'

import { Map, Marker, useMap } from '@vis.gl/react-google-maps'
import MapPosition from './MapPosition'
import FoobarMarker from './FoobarMarker'
import { useMapContext } from './MapContext'
import { routeros } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { useRouter } from 'next/navigation'

export default function FoobarMap({ children }: any) {
  const [initialMarkers, setInitialMarkers] = useMapContext()
  const router = useRouter()
  const map = useMap()
  console.log('initialMarkers', initialMarkers)

  return (
    <Map
      className="h-[320px] w-full"
      defaultZoom={3}
      defaultBounds={undefined}
      // defaultCenter={{ lat: 22.54992, lng: 0 }}
      clickableIcons={true}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      // zoomControlOptions={{ position: ControlPosition.LEFT_TOP }}
      mapTypeId={'roadmap'}
      mapId={'739af084373f96fe'}
    >
      {[initialMarkers].map((marker: any) => {
        const handleClick = () => router.push(`/map/${marker.id}`)
        return (
          <FoobarMarker
            key={JSON.stringify(marker)}
            position={{ lat: 41.09, lng: -71.875 }}
            // clickable={true}
            onClick={handleClick}
            title={'clickable google.maps.Marker'}
          >
            <div className="rounded-full bg-blue-500 border-4 border-white size-8 animate-in"></div>
          </FoobarMarker>
        )
      })}
    </Map>
  )
}
