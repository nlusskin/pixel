import db from './backend'
import RequireAuth from './auth/useAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req:NextApiRequest, res:NextApiResponse) => {
  if(!await RequireAuth(req, res)) return

  let form = JSON.parse(req.body)
  let {data, error} = await db.from('pixels').insert({
    ...form,
    user: req.cookies['_cuid']
  })
  res.json(data)
}
