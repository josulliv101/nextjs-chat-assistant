'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  Map,
  // Marker as FoobarMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import { Button } from './ui/button'
import { BotMessage } from './stocks'
import Link from 'next/link'
import FoobarMarker from './FoobarMarker'
import { useRouter } from 'next/navigation'
import { useMapContext } from './MapContext'

export function KnownFor({
  className,
  fields: { displayName, generativeSummary, location, photos = [] }
}: any) {
  const [state, setState] = useState(0)
  const photo = {
    name: 'places/ChIJ4Un7506e44kR7D8qSzKDqoQ/photos/AUGGfZkot955NbVMyLxHCevzUFqRAhMHiu-lSVjD1WAivYh3k9vY5RYV3RDYZZk91-eRyF20GtUoZBUQRPP-9U0t17vL96wpA2RcOj8bpThbJJM33QtzdgNyaHaGaa8Jiq3VsrrPtApAfj9S9cVzHzDTF81MHC-xnPj2qsjW'
  }

  const lat = location?.mapValue?.fields?.latitude?.doubleValue
  const lng = location?.mapValue?.fields?.longitude?.doubleValue
  const photoUrl = '/natalia-assistant.png' // `https://places.googleapis.com/v1/${photo.name}/media?&maxWidthPx=${240}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  const name = displayName?.mapValue?.fields?.text.stringValue

  const description =
    generativeSummary?.mapValue?.fields?.description?.mapValue?.fields?.text
      .stringValue
  console.log('props', lat, lng, state, description, generativeSummary)

  return (
    <>
      <div className=" max-w-sm w-full lg:max-w-full lg:block mb-0">
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex gap-4 justify-between leading-normal">
          <div className="mb-8">
            <p className="text-sm text-gray-600 flex justify-end items-center">
              <svg
                className="fill-current text-gray-500 w-3 h-3 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
              Blue Mushroom
            </p>
            <div className="text-gray-900 font-bold text-xl mb-2">
              <Button variant={'ghost'} asChild>
                <Link href={'/login'}>
                  {name} {state}
                </Link>
              </Button>
            </div>

            <p className="text-gray-700 mb-8 text-base">
              {description.slice(0, 220)}
            </p>
            <Image
              className="col-span-1 rounded-md w-full h-[160px] object-cover"
              key={photoUrl}
              src={photoUrl}
              width="240"
              height="240"
              alt="burger"
            />
          </div>
          {/* <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src="/mushroom.webp"
            alt="Avatar of Jonathan Reinink"
          />
          <div className="text-sm">
            <p className="text-gray-900 leading-none">Jonathan Reinink</p>
            <p className="text-gray-600">Aug 18</p>
          </div>
        </div> */}
        </div>
      </div>
    </>
  )
}

export function UnknownManager({ children }: any) {
  const [markers, setMarkers] = useMapContext()
  // const router = useRouter()
  console.log('UnknownManager', markers)
  useEffect(() => {
    setMarkers(markers)
  }, [markers])

  return <>{children}</>
}
