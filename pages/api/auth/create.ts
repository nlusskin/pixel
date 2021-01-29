import supabase from '../backend'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function _(q:NextApiRequest,s:NextApiResponse) {
  const {email, password} = JSON.parse(q.body)
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
  
  s.json(user)
}