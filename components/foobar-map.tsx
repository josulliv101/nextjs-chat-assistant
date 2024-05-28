'use client'

import { Map, Marker } from '@vis.gl/react-google-maps'
import MapPosition from './MapPosition'
import FoobarMarker from './FoobarMarker'
import { useMapContext } from './MapContext'

export default function FoobarMap({ children }: any) {
  const [initialMarkers, setInitialMarkers] = useMapContext()
  console.log('initialMarkers', initialMarkers)

  return (
    <Map
      className="h-[320px] w-full"
      defaultZoom={3}
      defaultBounds={undefined}
      defaultCenter={{ lat: 22.54992, lng: 0 }}
      clickableIcons={true}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      // zoomControlOptions={{ position: ControlPosition.LEFT_TOP }}
      mapTypeId={'roadmap'}
      mapId={'739af084373f96fe'}
    >
      {[initialMarkers].map((marker: any) => {
        return (
          <FoobarMarker
            key={JSON.stringify(marker)}
            position={{ lat: 41.09, lng: -71.875 }}
            // clickable={true}
            // onClick={() => console.log('marker was clicked!')}
            title={'clickable google.maps.Marker'}
          >
            <div className="rounded-full bg-blue-500 border-4 border-white size-8 animate-in"></div>
          </FoobarMarker>
        )
      })}
    </Map>
  )
}
