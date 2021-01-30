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

const DNT_HOSTS = new Set(['127.0.0.1:3000', 'localhost:3000', 'pixel.vercel.app'])

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const { query: { id } } = req

  // get ip data
  let ip = await fetch('http://ip-api.com/json/' + req.socket.remoteAddress)
  let { lat, lon } = await ip.json()
  
  let fpath = path.join(process.cwd(), 'public/pixel.png')
  await new Promise((r,j) => {
    let rstream = fs.createReadStream(fpath)
    rstream.pipe(res)
    rstream.on('end', r)
  })

  console.log(lat, lon, req.headers, id)
  if (DNT_HOSTS.has(req.headers.host)) return

  // perform insert
  let { data, error } = await db.from('events')
  .insert({
    timestamp: new Date(),
    location: [lat, lon],
    message: id
  })

  console.log(lat,lon,data,error)
  res.json(data)
}
