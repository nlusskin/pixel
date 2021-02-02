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
  let ip = await fetch('http://ip-api.com/json/' + q.headers['x-forwarded-for'])
  let json = await ip.json()
  let { lat, lon } = {lat: json.lat,lon: json.lon}
  
  let fpath = path.join(process.cwd(), 'public/pixel.png')
  await new Promise((r,j) => {
    let rstream = fs.createReadStream(fpath)
    rstream.pipe(s)
    rstream.on('end', r)
  })

  console.log(json, q.headers, id)
  let { data: user } = await db.from('pixels')
    .select(`
      user(
        ipAddress
      )
    `)
    .eq('id', id)
  
    console.info(user[0].ipAddress)
  if (user?.[0]?.user?.ipAddress == q.headers['x-forwarded-for']) return

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
