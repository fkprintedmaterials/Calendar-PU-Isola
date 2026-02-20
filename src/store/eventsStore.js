import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { writeAudit } from '../lib/audit'

export const useEventsStore = create((set, get) => ({
  events: [], eventTypes: [], loading: false,

  fetchEvents: async (startDate, endDate) => {
    set({ loading: true })
    const [evRes, typRes] = await Promise.all([
      supabase.from('events')
        .select('*, event_participants(person_id, persons(name,color))')
        .lte('start_date', endDate).gte('end_date', startDate).order('start_date'),
      supabase.from('event_types').select('*').order('sort_order'),
    ])
    set({ events: evRes.data || [], eventTypes: typRes.data || [], loading: false })
  },

  createEvent: async (payload, participantIds = []) => {
    const { data, error } = await supabase.from('events').insert(payload).select().single()
    if (error) throw error
    if (participantIds.length > 0)
      await supabase.from('event_participants').insert(participantIds.map(pid => ({ event_id: data.id, person_id: pid })))
    writeAudit({ action:'INSERT', tableName:'events', recordId:data.id,
      description:`Creato evento "${data.title}" (${data.start_date} → ${data.end_date})`, newData:data })
    const { data: fresh } = await supabase.from('events')
      .select('*, event_participants(person_id, persons(name,color))').eq('id', data.id).single()
    set(s => ({ events: [...s.events, fresh || data] }))
    return data
  },

  deleteEvent: async (event) => {
    await supabase.from('event_participants').delete().eq('event_id', event.id)
    await supabase.from('events').delete().eq('id', event.id)
    writeAudit({ action:'DELETE', tableName:'events', recordId:event.id,
      description:`Eliminato evento "${event.title}"`, oldData:event })
    set(s => ({ events: s.events.filter(e => e.id !== event.id) }))
  },

  eventsForDate: (dateStr) => get().events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr),
  getEventType:  (id)      => get().eventTypes.find(t => t.id === id),
}))
