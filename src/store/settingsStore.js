import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useSettingsStore = create((set, get) => ({
  settings: {
    app_title: 'Calendar Impegni PU Isola',
    logo_url: null,
    working_hours_lun_gio: 8,
    working_hours_ven: 7,
    local_holidays: [],
  },
  fetchSettings: async () => {
    const { data } = await supabase.from('settings').select('*')
    if (!data) return
    const merged = { ...get().settings }
    data.forEach(r => { merged[r.key] = r.value })
    set({ settings: merged })
  },
}))
