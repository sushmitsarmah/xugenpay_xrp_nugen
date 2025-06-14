import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_API_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API Key must be provided')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized')
  }
  return supabase
};

export const checkSupabaseConnection = async () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized')
  }

  try {
    const { error } = await supabase.storage.listBuckets()
    if (error) throw error
    console.log('Supabase connection working')
  } catch (err) {
    console.error('Supabase connection failed:', err)
    throw err
  }

  return supabase
};