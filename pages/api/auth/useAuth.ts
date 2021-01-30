import supabase from '../backend'
import { NextApiRequest, NextApiResponse } from 'next'

import AuthCheck from './get'

export default async function _(q:NextApiRequest,_s:NextApiResponse) {

  const s = new HttpResponseShim()
  // @ts-expect-error
  await AuthCheck(q, s)
  if (s.jsonVal?.aud !== 'authenticated') {
    _s.status(401).send(null)
    return false
  }
  return true
}


type AuthCheckType = { aud: string}

class HttpResponseShim {
  jsonVal: AuthCheckType
  constructor() {
    this.jsonVal = { aud: 'false'}
  }

  json = (j:AuthCheckType) => {
    this.jsonVal = j
  }

  setHeader = (o:string, p:[]) => { }

  status = (c:number) => {
    return { send: (d:any) => { } } 
  }
}