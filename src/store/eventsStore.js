import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useEventsStore = create((set, get) => ({
  events: [],
  eventTypes: [],
  participants: {},  // { event_id: [person_id, ...] }
  loading: false,
  error: null,

  /** Carica eventi + tipi evento + partecipanti per un range di date */
  fetchEvents: async (startDate, endDate) => {
    set({ loading: true, error: null })
    try {
      const [evRes, typRes, partRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .lte('start_date', endDate)
          .gte('end_date', startDate)
          .order('start_date'),
        supabase.from('event_types').select('*'),
        supabase
          .from('event_participants')
          .select('event_id, person_id, persons(name, color)'),
      ])

      if (evRes.error)  throw evRes.error
      if (typRes.error) throw typRes.error

      // Raggruppa partecipanti per evento
      const participants = {}
      ;(partRes.data || []).forEach(p => {
        if (!participants[p.event_id]) participants[p.event_id] = []
        participants[p.event_id].push(p)
      })

      set({
        events: evRes.data || [],
        eventTypes: typRes.data || [],
        participants,
        loading: false,
      })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  /** Crea un nuovo evento */
  createEvent: async (payload, participantIds = []) => {
    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single()
    if (error) throw error

    if (participantIds.length > 0) {
      await supabase.from('event_participants').insert(
        participantIds.map(pid => ({ event_id: data.id, person_id: pid }))
      )
    }
    return data
  },

  /** Elimina un evento */
  deleteEvent: async (id) => {
    await supabase.from('event_participants').delete().eq('event_id', id)
    await supabase.from('events').delete().eq('id', id)
    set(s => ({ events: s.events.filter(e => e.id !== id) }))
  },

  /** Restituisce eventi per una data specifica */
  eventsForDate: (dateStr) => {
    return get().events.filter(e =>
      e.start_date <= dateStr && e.end_date >= dateStr
    )
  },

  /** Trova il tipo evento per id */
  getEventType: (id) => get().eventTypes.find(t => t.id === id),
}))
