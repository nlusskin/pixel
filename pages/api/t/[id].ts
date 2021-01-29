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

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const { query: { id } } = req

  // get ip data
  let ip = await fetch('http://ip-api.com/json/' + req.socket.remoteAddress)
  let { lat, lon } = await ip.json()
  
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
