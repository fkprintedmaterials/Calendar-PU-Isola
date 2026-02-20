import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  persons: [],
  loading: true,
  init: async () => {
    const { data } = await supabase.from('persons').select('*').eq('active', true).order('name')
    set({ persons: data || [], loading: false })
  },
}))
