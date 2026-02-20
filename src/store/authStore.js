import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { getPersonProfile } from '../lib/auth'

export const useAuthStore = create((set, get) => ({
  session:  null,
  person:   null,   // profilo persons dalla tabella DB
  loading:  true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const person = await getPersonProfile(session.user.id)
      set({ session, person, loading: false })
    } else {
      set({ session: null, person: null, loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const person = await getPersonProfile(session.user.id)
        set({ session, person })
      } else {
        set({ session: null, person: null })
      }
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, person: null })
  },

  isAdmin: () => get().person?.is_admin === true,
}))
