import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import db from '../backend'

type PixelRecord = {
  id: string
  subject: string
  recipient: string
  sentAt: Date
  events: {
    lastRead: Date
    readCount: number
    location: [number|null, number|null] | null
  }[]
}


export default async (q:NextApiRequest, s:NextApiResponse) => {
  const { query: { id } } = q

  // get ip data
  let ip = await fetch('http://ip-api.com/json/' + /\d+\.\d+\.\d+\.\d+/.exec(q.socket.remoteAddress)[0])
  let json = await ip.json()
  let { lat, lon } = {lat: json.lat,lon: json.lon}
  
  let fpath = path.join(process.cwd(), 'public/pixel.png')
  await new Promise((r,j) => {
    let rstream = fs.createReadStream(fpath)
    rstream.pipe(s)
    rstream.on('end', r)
  })

  console.log(json, q.headers, id)
  let { data: user } = await db.from('users')
    .select('*')
    .eq('ipAddress', /\d+\.\d+\.\d+\.\d+/.exec(q.socket.remoteAddress)[0])

  if (user?.[0]?.id == q.cookies._cuid) return

  // perform insert
  let { data, error } = await db.from('events')
  .insert({
    timestamp: new Date(),
    location: [lat, lon],
    message: id
  })

  console.log(lat,lon,data,error)
  s.json(data)
}
