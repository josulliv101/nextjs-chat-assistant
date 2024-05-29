'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useUIState, useAIState } from 'ai/rsc'
import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import MapPosition from '@/components/MapPosition'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { useRouter } from 'next/navigation'
import React, { PropsWithChildren } from 'react'
import { TooltipPortal } from '@radix-ui/react-tooltip'

export default function MapBM({ children }: PropsWithChildren<{}>) {
  const [aiState] = useAIState()
  const [uiState] = useUIState()
  const router = useRouter()
  const { markers = [] } = aiState
  const [initialMarkers, setInitialMarkers] = useMapContext()
  console.log('aiState', aiState)
  console.log('uiState', uiState)
  console.log('initialMarkers', initialMarkers)

  return (
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
        {children}
        {markers.map((marker: any) => {
          console.log('...', marker, marker.lat, marker.lng)
          const handleClick = () => router.push(`/map/${marker.id}`)

          return (
            <FoobarMarker
              id={marker?.id}
              key={JSON.stringify(marker)}
              position={marker}
              clickable={true}
              // onClick={handleClick}
              title={marker?.name || 'unknown'}
            >
              <div className="rounded-full z-[9999] bg-blue-500 border-4 border-white size-8 animate-in"></div>
            </FoobarMarker>
          )
        })}
      </Map>
    </MapPosition>
  )
}
