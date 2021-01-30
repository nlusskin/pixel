import { NextApiRequest, NextApiResponse } from 'next'
import db from './backend'

import RequireAuth from './auth/useAuth'

export default async (req:NextApiRequest, res:NextApiResponse) => {
  if(!await RequireAuth(req)) return

  let {data, error} = await db.from('pixels').select(`
    *,
    events(*)

  `)
  res.json(data)
}
