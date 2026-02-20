import { supabase } from './supabase'

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

export const onAuthStateChange = (cb) =>
  supabase.auth.onAuthStateChange((_event, session) => cb(session))

/** Recupera il profilo person legato all'utente loggato */
export const getPersonProfile = async (userId) => {
  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('auth_user_id', userId)
    .single()
  if (error) return null
  return data
}
