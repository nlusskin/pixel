import supabase from '../backend'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session as SessionType, User } from '@supabase/supabase-js'

type AuthReturnType = { data?: SessionType, error?: Error}


export default async function _(q:NextApiRequest,s:NextApiResponse) {
  
  const {_cutok, _curef, _cuid} = q.cookies
  const {email, password} = JSON.parse(q.body || '{}')

  let user = {} as AuthReturnType
  if (email && password) user = await passwordGrant(email, password)
  if (_cutok && _curef && _cuid && !email) user = await tokenGrant(_cutok, _curef, _cuid)

  if (user.error || (!user.data.access_token && !user.data.user)) {
    console.error(user.error) 
    return s.status(403).send(null)
  }
  
  if (user.data.access_token) {
    s.setHeader('SET-COOKIE', [
      `_cutok=${user.data.access_token}; Path=/; Max-Age=864000; `,
      `_curef=${user.data.refresh_token}; Path=/;  Max-Age=864000; `,
      `_cuid=${user.data.user.id}; Path=/;  Max-Age=864000; `,
    ]) //Max-Age=${process.env.JWT_EXP}

    return s.json(user.data)
  }

  await supabase.from('users').insert({
    id: user.data.user.id,
    ipAddress: /\d+\.\d+\.\d+\.\d+/.exec(q.socket.remoteAddress)[0]
  }, {upsert: true})

  s.json(user.data.user)
}

// TOKEN
async function tokenGrant(_cutok:string, _curef:string, _cuid:string): Promise<AuthReturnType> {
  try {
    const user = await supabase.auth.api.getUser(_cutok)
    
    if (/expired/.test(user.error?.message)) {
      let {data: refUser} = await supabase.auth.api.refreshAccessToken(_curef)
      console.info('REF:',_curef,refUser)
      
      if(!refUser?.user?.id)
        return { error: new Error('Could not authenticate with provided token. Try using a password')}
      if(refUser?.user?.id != _cuid)
        return { error: new Error('ID doesn\'t match')}
      

      return { data: refUser }
    }
    return { 
      data: {
        access_token: '',
        refresh_token: '',
        expires_in: 0,
        token_type: '',
        user: user.data
      }
    }
  }
  catch (e) {
    return { error: e}
  }
}

// PASSWORD
async function passwordGrant(email:string, password:string): Promise<AuthReturnType> {
  const { data, user, error } = await supabase.auth.signIn({
    email: email,
    password: password
  })

  return { data: data, error: error}
}