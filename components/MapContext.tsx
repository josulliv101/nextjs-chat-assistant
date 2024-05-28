'use client'

import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

const Context = createContext<any>(null)

export function MapContextProvider({ children }: PropsWithChildren<{}>) {
  const stateTuple = useState([{ lat: 41.09, lng: -71.875, zoom: 8 }])
  return <Context.Provider value={stateTuple}>{children}</Context.Provider>
}

export function useMapContext() {
  return useContext(Context)
}
