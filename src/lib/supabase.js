import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Variabili Supabase mancanti.\n' +
    'Copia .env.example in .env.local e inserisci i tuoi valori.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
