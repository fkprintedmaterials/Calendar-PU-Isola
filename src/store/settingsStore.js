import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useSettingsStore = create((set, get) => ({
  settings: {
    app_title: 'Calendar Impegni PU Isola',
    logo_url: null,
    working_hours_lun_gio: 8,
    working_hours_ven: 7,
    local_holidays: [],   // festivi aggiuntivi locali ["YYYY-MM-DD"]
    current_year: new Date().getFullYear(),
  },
  loaded: false,

  fetchSettings: async () => {
    const { data } = await supabase.from('settings').select('*')
    if (!data) return
    const merged = { ...get().settings }
    data.forEach(row => { merged[row.key] = row.value })
    set({ settings: merged, loaded: true })
  },

  updateSetting: async (key, value) => {
    await supabase.from('settings').upsert({ key, value })
    set(s => ({ settings: { ...s.settings, [key]: value } }))
  },
}))
