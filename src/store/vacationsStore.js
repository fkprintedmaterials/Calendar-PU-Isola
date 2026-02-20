import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { writeAudit } from '../lib/audit'

export const useVacationsStore = create((set, get) => ({
  entries: [], loading: false,

  fetchAll: async () => {
    set({ loading: true })
    const { data } = await supabase.from('vacation_entries')
      .select('*, persons(name, color)').order('date')
    set({ entries: data || [], loading: false })
  },

  insert: async (payload) => {
    const { data, error } = await supabase.from('vacation_entries')
      .insert(payload).select('*, persons(name)').single()
    if (error) throw error
    writeAudit({ action:'INSERT', tableName:'vacation_entries', recordId:data.id,
      description:`Inserita "${data.type}" il ${data.date} (${data.hours}h) — ${data.persons?.name || ''}`,
      newData:{ ...data, persons:undefined } })
    set(s => ({ entries: [...s.entries, data] }))
    return data
  },

  remove: async (entry) => {
    await supabase.from('vacation_entries').delete().eq('id', entry.id)
    writeAudit({ action:'DELETE', tableName:'vacation_entries', recordId:entry.id,
      description:`Eliminata "${entry.type}" del ${entry.date} (${entry.hours}h) — ${entry.persons?.name || ''}`,
      oldData:{ ...entry, persons:undefined } })
    set(s => ({ entries: s.entries.filter(e => e.id !== entry.id) }))
  },
}))
