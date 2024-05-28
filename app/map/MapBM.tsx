'use client'

import { useUIState, useAIState } from 'ai/rsc'
import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import MapPosition from '@/components/MapPosition'
import { Map, Marker } from '@vis.gl/react-google-maps'

export default function MapBM() {
  const [aiState] = useAIState()
  const [uiState] = useUIState()
  const { markers = [] } = aiState
  const [initialMarkers, setInitialMarkers] = useMapContext()
  console.log('aiState', aiState)
  console.log('uiState', uiState)
  console.log('initialMarkers', initialMarkers)
  return (
    <>
      <MapPosition distance={10}>
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
          {markers.map((marker: any) => {
            console.log('...', marker, marker.lat, marker.lng)
            return (
              <FoobarMarker
                key={JSON.stringify(marker)}
                position={marker}
                // clickable={true}
                // onClick={() => console.log('marker was clicked!')}
                title={marker?.name || 'unknown'}
              >
                <div className="rounded-full bg-blue-500 border-4 border-white size-8 animate-in"></div>
              </FoobarMarker>
            )
          })}
        </Map>
      </MapPosition>
      <div className="p-12">
        <h2>Other Stuff</h2>
        <p>{JSON.stringify(aiState)}</p>
      </div>
    </>
  )
}
