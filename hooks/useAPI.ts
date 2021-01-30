import React from 'react'

declare type getops = 'list'
declare type postops = 'create'|'update'|'delete'|'get'
declare type actions = 'auth'
declare type get_endpoints = `${getops}` | `${actions}/${getops}`
declare type post_endpoints = `${postops}` | `${actions}/${postops}`

declare type U = get_endpoints|post_endpoints

function _useAPI<T>(endpoint: U) {

  const [res, setRes] = React.useState<T | {error?: boolean}>()

  const _call =  React.useCallback((data?:any) => {
    let postdata = data ? {
      method: 'POST',
      body: JSON.stringify(data)
    } : null

    const fn = async () => {
      let res = await fetch('/api/'+endpoint, postdata)
      console.info('json',res)
      if (!res.ok) {
        setRes({error: true})
        return
      }
      let json = {}
      try {
        json = await res.json()
      }
      catch (e) { console.error(e) }
      setRes(json)
    }

    fn()
  }, [])

  React.useEffect(() => { if (/(list)/.test(endpoint)) { _call() } }, [])

  return {data: res, call: _call }
}

function useAPI<T>(endpoint: get_endpoints) : { data: any, call: () => any } //ReturnType<typeof _useAPI>
function useAPI<T>(endpoint: post_endpoints) : { data: any, call: (data:any) => any }
function useAPI<T>(endpoint: get_endpoints|post_endpoints) { return _useAPI<T>(endpoint) }

export { useAPI }