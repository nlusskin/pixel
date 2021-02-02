
import { Map as MKMap, Marker } from 'react-mapkit'
import React from 'react'
import load from 'little-loader'

import { useAPI } from '../hooks/useAPI'

declare namespace mapkit { 
  let init: any
  let Geocoder: any
  let Coordinate: any
}


export default function Map(p:Iprops) {

  const {data: token, call: fetchToken } = useAPI('maptoken')
  React.useEffect(fetchToken, [])
  React.useEffect(() => console.log(token), [token])

  const [loc, setLoc] = React.useState({formattedAddress: null})

  React.useEffect(() => {
    if(!token || !p.coords || p.display !== 'address') return
    load('https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js', () => {

      // init mapkit
      mapkit.init({
        authorizationCallback: (done) => {
          done(token.maptoken)
        }
      })
      let geocoder = new mapkit.Geocoder({ language: 'en-GB', getUserLocation: false})
      geocoder.reverseLookup(new mapkit.Coordinate(p.coords[0], p.coords[1]), (err,data) => {
        if (err) console.error(err)
        setLoc(data.results[0])
      })
    })
  }, [token])

  if (!token || !p.coords) return <p>Loading...</p>

  if (p.display == 'address') return <p>{loc.formattedAddress}</p>

  return (
    <div className='w-1/3 h-48'>
      <MKMap tokenOrCallback={token.maptoken as string} center={p.coords}>
        <Marker latitude={p.coords[0]} longitude={p.coords[1]} />
      </MKMap>
    </div>
  )
}

type Iprops = {
  coords: [number, number]
  display?: 'map'|'address'
}