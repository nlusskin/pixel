import Auth from './auth'
import View from './view'
import { useAPI } from '../hooks/useAPI'
import React from 'react'

import AppContext from '../hooks/context'

export default function Home() {
  const [state, _setState] = React.useState<any>({})
  const setState = (newState: object) => {
    _setState({...state, ...newState})
  }

  React.useEffect(() => console.log('state',state), [state])
  React.useEffect(() => {
    let isAuthenticated = (state?.userAuth?.user?.aud === 'authenticated' ||
        state?.userAuth?.aud === 'authenticated')
    setState({isAuthenticated: isAuthenticated})
  }, [state.userAuth])


  return (
    <AppContext.Provider value={{state: state, setState: setState}}>
      <div className='w-full h-full p-12 overflow-hidden'>
        {!state.isAuthenticated && <Auth/>}
        {state.isAuthenticated && <View />}
      </div>
    </AppContext.Provider>
  )
}


