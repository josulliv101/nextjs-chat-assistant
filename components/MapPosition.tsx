'use client'

import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import Link from 'next/link'
import { PropsWithChildren, use, useEffect, useState } from 'react'
import FoobarMarker from './FoobarMarker'
import { useMapContext } from './MapContext'
import { useAIState } from 'ai/rsc'

export default function MapPosition({
  // markers = [],
  hub,
  distance = 10,
  hubName,
  children
}: PropsWithChildren<{
  distance: number
  hub?: string
  hubName?: string
}>) {
  const map = useMap()

  const [aiState] = useAIState()

  const { markers: rawMarkers = [] } = aiState
  const markers = rawMarkers.filter(
    (m: any) => m.id && m.lat && m.lng && m.name
  )

  console.log('MAP rawMarkers', rawMarkers)
  // const [initialMarkers, setInitialMarkers] = useMapContext()
  const coreLib = useMapsLibrary('core')

  // const [markerStatusMap, setMarkerStatusMap] = use(MapMarkerContext);
  const [initalMapPosition, setInitialMapPosition] = useState<any>(null)
  const [initalZoom, setInitialZoom] = useState<any>(null)
  const [currentMapPosition, setCurrentMapPosition] = useState<any>(null)
  // const [initialMarkers, setInitialMarkers] = useState(mapState)

  useEffect(() => {
    if (!coreLib || !map || !markers || markers.length == 0) {
      return
    }

    const { LatLng, LatLngBounds } = coreLib
    const bounds = new coreLib.LatLngBounds()
    // const sw = new LatLng(bounds.sw.latitude, bounds.sw.longitude);
    // const ne = new LatLng(bounds.ne.latitude, bounds.ne.longitude);

    // const initialMarkerStatusMap: Record<
    //   string,
    //   { isWithinMapBounds: boolean }
    // > = {};

    if (bounds) {
      markers.forEach((marker: any) => {
        bounds.extend(new coreLib.LatLng(marker))
        // if (marker.id) {
        //   initialMarkerStatusMap[marker.id] = {
        //     isWithinMapBounds: true,
        //   };
        // }
      })
    }

    if (markers.length === 1 && markers[0].isCity) {
      map.setCenter(markers[0])
      const z = getHubMapZoom(markers[0].mapZoom, distance)
      return map.setZoom(z)
    } else if (markers.length === 1) {
      console.log('MARKERS', markers)
      const zProfile = markers[0]?.zoom
      map.setZoom(zProfile || 14)

      map.setCenter(markers[0])
    } else {
      map.fitBounds(bounds)
    }

    // setInitialMapPosition(bounds.getCenter().toString());

    // setMarkerStatusMap(initialMarkerStatusMap);

    //const initialBounds = bounds.toJSON();

    // setInitialBounds(bounds.toJSON());
  }, [coreLib, markers, map])

  // useEffect(() => {
  //   if (!coreLib || !map || !markers || !markers.length) return

  //   map.addListener('idle', () => {
  //     console.log('add idle listener', markers)
  //     const tmp: Record<string, any> = {}
  //     for (let i = 0; i < markers.length; i++) {
  //       const latlng = new coreLib.LatLng(markers[i]._geoloc)
  //       const isWithinBounds = map?.getBounds()?.contains(latlng)
  //       console.log('markers[i]', markers[i])
  //       tmp[markers[i].objectID || markers[i].id] = { isWithinBounds }
  //     }
  //     // setMarkerStatusMap(tmp)
  //     const mapBounds = map.getBounds()
  //     console.log('update map positions', initalMapPosition, currentMapPosition)
  //     mapBounds && setCurrentMapPosition(mapBounds)
  //     mapBounds && setInitialZoom(map.getZoom())
  //     // !initalMapPosition && center && setInitialMapPosition(center.toString());
  //   })

  //   // TODO remove listener
  // }, [coreLib, map, markers])

  // useEffect(() => {
  //   if (currentMapPosition && !initalMapPosition) {
  //     setInitialMapPosition(currentMapPosition)
  //   }
  // }, [currentMapPosition])

  //   useEffect(() => {
  //     const marker = markers.find(
  //       marker => marker.objectID === requestToResetId?.pan
  //     )
  //     if (requestToResetId && marker && map) {
  //       google.maps.event.addListenerOnce(map, 'idle', function () {
  //         setTimeout(() => setMapState(marker.objectID), 400)
  //       })
  //       setMapState('')
  //       map?.panTo(marker._geoloc)
  //     }
  //   }, [ markers])

  return <>{children} </>
}

function getHubMapZoom(defaultZoom = 13, distance = 0) {
  const d = Number(distance)
  if (d === 0) {
    return defaultZoom
  }
  if (d === 4) {
    return defaultZoom - 1
  }
  return defaultZoom - 2
}
