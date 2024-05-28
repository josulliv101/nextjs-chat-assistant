'use client'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger
} from '@/components/ui/tooltip2'
import Image from 'next/image'
import {
  Marker,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps'

import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { routeros } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { useRouter } from 'next/navigation'
import { useAIState } from 'ai/rsc'
import { useEffect } from 'react'

const thumbnailSize = 140

export default function FoobarMarker({
  id,
  children,
  excellence,
  photoUrl,
  parentPhotoUrl,
  position,
  size = 24,
  title = 'foo',
  // onClick,
  ...props
}: any) {
  const map = useMap()
  const coreLib = useMapsLibrary('core')
  const router = useRouter()
  const [aiState, setAiState] = useAIState()

  const [markerRef, marker] = useAdvancedMarkerRef()

  const isWithinBounds =
    !!marker?.position && map?.getBounds()?.contains(marker?.position)

  const onClick = () => {
    console.log('onClick', id)
    router.push(`/map/${id}`)
  }

  // useEffect(() => {
  //   if (position && markers) {
  //     setAiState({
  //       ...aiState,
  //       markers: [position]
  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!coreLib || !map || !marker) return;
  //   if (requestToPan) {
  //     setMapState("");
  //     marker.position && map.panTo(marker.position);
  //   }
  // }, [coreLib, map, requestToPan]);

  // useEffect(() => {
  //   if (mapState === id) {
  //     const isWithinBounds =
  //       !!marker?.position && map?.getBounds()?.contains(marker?.position);
  //     console.log("mapState change", isWithinBounds, marker?.position);
  //     if (isWithinBounds) {
  //       handleMouseOver();
  //     }
  //   }
  // }, [mapState]);

  return (
    <AdvancedMarker
      className="foobar-marker animate-fade rounded-full"
      ref={markerRef}
      clickable={true}
      // title={title}
      onClick={onClick}
      position={position}
      zIndex={999}
    >
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <div>{children}</div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>{title}</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </AdvancedMarker>
  )
}
