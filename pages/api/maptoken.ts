import fs from 'fs'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import RequireAuth from './auth/useAuth'

const EXPIRES = 60

const payload = {
  iat: Date.now() / 1000,
  iss: null,
  exp: null
}

const header = {
  typ: 'JWT',
  alg: 'ES256',
  kid: null
}

const authKey = '-----BEGIN PRIVATE KEY-----\n' + process.env.MAPKIT_KEY + '\n-----END PRIVATE KEY-----'

payload.iss = process.env.APPLE_TEAM_ID
header.kid = process.env.MAPKIT_KEY_ID


export default async function _(q:NextApiRequest,s:NextApiResponse) {
  if(!await RequireAuth(q, s)) return
  
  payload.exp = Date.now() / 1000 + EXPIRES * 60

  var token = jwt.sign(payload, authKey, { header: header })
  s.send({maptoken: token})
}