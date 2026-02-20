import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || url.includes('METTI-QUI')) {
  console.error('❌  Apri il file .env.local e inserisci le credenziali Supabase')
}

export const supabase = createClient(url, key)
