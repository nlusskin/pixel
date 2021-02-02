import supabase from '../backend'
import { NextApiRequest, NextApiResponse } from 'next'

import AuthCheck from './get'

export default async function _(q:NextApiRequest,_s:NextApiResponse) {

  const s = new HttpResponseShim(_s)
  // @ts-expect-error
  await AuthCheck(q, s)

  if (s.jsonVal?.user?.aud !== 'authenticated' && s.jsonVal?.aud !== 'authenticated') {
    _s.status(401).send(null)
    return false
  }
  return true
}


type AuthCheckType = {user?: { aud: string}, aud?: string}

class HttpResponseShim {
  jsonVal: AuthCheckType
  res: NextApiResponse
  constructor(res:NextApiResponse) {
    this.jsonVal = {user: { aud: 'false'}}
    this.res = res
  }

  json = (j:AuthCheckType) => {
    this.jsonVal = j
  }

  setHeader = (o:string, p:[]) => {
    this.res.setHeader(o, p)
  }

  status = (c:number) => {
    return { send: (d:any) => { } } 
  }
}