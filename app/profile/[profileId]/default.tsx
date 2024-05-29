import FoobarMarker from '@/components/FoobarMarker'
import { useMapContext } from '@/components/MapContext'
import fetchPlaces from '@/lib/chat/fetchPlaces'

export default async function Page({ params: { placeId } }: any) {
  return (
    <>
      <div className="mt-8 px-12 bg-pink-500">
        <h2>Default</h2>
      </div>
    </>
  )
}
