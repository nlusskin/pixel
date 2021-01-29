import supabase from '../backend'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function _(q:NextApiRequest,s:NextApiResponse) {
  const {_cutok, _curef, _cuid} = q.cookies
  
  const user = await supabase.auth.api.getUser(_cutok)

  if (/expired/.test(user.error?.message)) {
    let {data: refUser} = await supabase.auth.api.refreshAccessToken(_curef)
    console.log(refUser)
    if(refUser.user.id != _cuid) return s.status(403).send(null)
    s.setHeader('SET-COOKIE', `_cutok=${refUser.access_token}; `) //Max-Age=${process.env.JWT_EXP}
    s.setHeader('SET-COOKIE', `_curef=${refUser.refresh_token}; `)
    return s.json(refUser)
  }

  s.json(user || {})
}