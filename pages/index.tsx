import Auth from './auth'
import View from './view'
import { useAPI } from '../hooks/useAPI'
import React from 'react'


export default function Home() {

  let {data: authStatus, call: getAuthStatus} = useAPI('auth/get')
  React.useEffect(() => getAuthStatus(null), [])
  React.useEffect(() => console.info('AUTH', authStatus), [authStatus])

  return (
    <div className='w-full h-full p-12 overflow-hidden'>
      {!authStatus && <Auth/>}
      {authStatus && <View />}
    </div>
  )
}


