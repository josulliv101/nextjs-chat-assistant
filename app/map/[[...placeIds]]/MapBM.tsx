'use client'

import { useUIState, useAIState } from 'ai/rsc'
import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import MapPosition from '@/components/MapPosition'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { useRouter } from 'next/navigation'

export default function MapBM() {
  const [aiState] = useAIState()
  const [uiState] = useUIState()
  const router = useRouter()
  const { markers = [] } = aiState
  const [initialMarkers, setInitialMarkers] = useMapContext()
  console.log('aiState', aiState)
  console.log('uiState', uiState)
  console.log('initialMarkers', initialMarkers)
  return (
    <div className="grid grid-cols-12">
      <div className="w-[30vw] col-span-4 text-white bg-gray-800 px-8 py-6">
        aside
      </div>
      <MapPosition distance={10}>
        <Map
          className="h-[320px] w-full col-span-8"
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
          {markers.map((marker: any) => {
            console.log('...', marker, marker.lat, marker.lng)
            const handleClick = () => router.push(`/map/${marker.id}`)
            return (
              <FoobarMarker
                key={JSON.stringify(marker)}
                position={marker}
                // clickable={true}
                onClick={handleClick}
                title={marker?.name || 'unknown'}
              >
                <div className="rounded-full bg-blue-500 border-4 border-white size-8 animate-in"></div>
              </FoobarMarker>
            )
          })}
        </Map>
      </MapPosition>
    </div>
  )
}
