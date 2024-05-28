'use client'

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

const thumbnailSize = 140

export default function FoobarMarker({
  id,
  children,
  excellence,
  photoUrl,
  parentPhotoUrl,
  size = 24,
  title,
  onClick,
  ...props
}: any) {
  const map = useMap()
  const coreLib = useMapsLibrary('core')

  const [markerRef, marker] = useAdvancedMarkerRef()

  const isWithinBounds =
    !!marker?.position && map?.getBounds()?.contains(marker?.position)

  const handleMouseOver = () => {
    console.log('hover')
  }

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
      className="foobar-marker animate-fade"
      ref={markerRef}
      clickable={true}
      {...props}
      title={title}
      onClick={onClick}
    >
      <div className="relative">{children}</div>
    </AdvancedMarker>
  )
}
