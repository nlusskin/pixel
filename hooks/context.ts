import React from 'react'

const context = {
  state: {} as any,
  setState: (o:object) => { }
}

const AppContext = React.createContext(context)

export default AppContext