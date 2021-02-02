import { NextApiRequest, NextApiResponse } from 'next'
import db from './backend'

import RequireAuth from './auth/useAuth'

export default async (req:NextApiRequest, res:NextApiResponse) => {
  if(!await RequireAuth(req, res)) return

  let {data, error} = await db.from('pixels').select(`
    *,
    events(*)

  `)
  .eq('user', req.cookies['_cuid'])

  res.json(data)
}
