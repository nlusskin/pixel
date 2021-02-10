
import { Map as MKMap, Marker } from 'react-mapkit'
import React from 'react'
import load from 'little-loader'
//const mapkit = require('https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js')

import { useAPI } from '../hooks/useAPI'
import Address from './Address'

declare namespace mapkit { 
  let init: any
  let Geocoder: any
  let Coordinate: any
  let addEventListener: any
}

export default function Map(p:Iprops) {

  // only render if coords are provided
  if (typeof p.coords?.[0] !== 'number' || typeof p.coords?.[1] !== 'number') return null

  const {data: token, call: fetchToken } = useAPI('maptoken')
  React.useEffect(fetchToken, [])

  if (p.display == 'address') return <Address coords={p.coords} token={token?.maptoken} />

  return (
    <div className='w-full h-36'>
      <MKMap tokenOrCallback={token?.maptoken as string} center={p.coords}>
        <Marker latitude={p.coords[0]} longitude={p.coords[1]} />
      </MKMap>
    </div>
  )
}


type Iprops = {
  coords: [number, number]
  display?: 'map'|'address'
}