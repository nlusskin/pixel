import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabaseURL = 'https://vlhuyrwlkwapyrjdospc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export default createClient(supabaseURL, supabaseKey)