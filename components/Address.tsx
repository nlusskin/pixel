import { every } from 'lodash'
import { Map as MKMap, Marker } from 'react-mapkit'
import React from 'react'
import load from 'little-loader'

import { useAPI } from '../hooks/useAPI'

declare namespace mapkit { 
  let init: any
  let Geocoder: any
  let Coordinate: any
  let addEventListener: any
}

export default function Address(p:Iprops) {

  // only render if coords are provided
  if (typeof p.coords?.[0] !== 'number' || typeof p.coords?.[1] !== 'number') return null

  const [loc, setLoc] = React.useState({
    formattedAddress: null,
    locality: null,
    administrativeAreaCode: null,
    countryCode: null
  })

  React.useEffect(() => {
    if(!p.token || !p.coords) return
    load('https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js', () => {
      console.log('loaded mapkit')
    
      // init mapkit
      mapkit.init({
        authorizationCallback: (done) => {
          done(p.token)
        }
      })
      let geocoder = new mapkit.Geocoder({ language: 'en-GB', getUserLocation: false})
      geocoder.reverseLookup(new mapkit.Coordinate(p.coords[0], p.coords[1]), (err,data) => {
        if (err) console.error(err)
        setLoc(data.results[0])
      })
      // mapkit.addEventListener('error', setTimeout(() => fetchToken(), 750))
    })
  }, [p.token])

  if (!p.token || !p.coords || every(loc, null)) return <p>Loading...</p>

  return <p>{loc.locality}, {loc.administrativeAreaCode}, {loc.countryCode}</p>
}



type Iprops = {
  token: string
  coords: [number, number]
}