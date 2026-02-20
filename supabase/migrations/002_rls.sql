-- ══════════════════════════════════════════════
--  002_rls.sql  –  Row Level Security
--  Definisce chi può leggere/scrivere cosa
-- ══════════════════════════════════════════════

-- Abilita RLS su tutte le tabelle
ALTER TABLE public.persons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gemba_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings          ENABLE ROW LEVEL SECURITY;

-- Helper: ritorna TRUE se l'utente corrente è admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.persons WHERE auth_user_id = auth.uid()),
    FALSE
  );
$$;

-- Helper: ritorna l'id person dell'utente corrente
CREATE OR REPLACE FUNCTION public.my_person_id()
RETURNS UUID
LANGUAGE SQL SECURITY DEFINER
AS $$
  SELECT id FROM public.persons WHERE auth_user_id = auth.uid();
$$;

-- ── PERSONS ──────────────────────────────────
-- Tutti gli utenti loggati possono leggere le persone attive
CREATE POLICY "persons_select" ON public.persons
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admin possono creare/modificare/eliminare persone
CREATE POLICY "persons_insert" ON public.persons
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "persons_update" ON public.persons
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "persons_delete" ON public.persons
  FOR DELETE USING (public.is_admin());

-- ── EVENT TYPES ───────────────────────────────
-- Tutti leggono, solo admin modificano
CREATE POLICY "event_types_select" ON public.event_types
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "event_types_all" ON public.event_types
  FOR ALL USING (public.is_admin());

-- ── EVENTS ────────────────────────────────────
-- Tutti leggono gli eventi
CREATE POLICY "events_select" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin possono fare tutto; utenti normali solo i propri
CREATE POLICY "events_insert" ON public.events
  FOR INSERT WITH CHECK (
    public.is_admin() OR created_by = public.my_person_id()
  );

CREATE POLICY "events_update" ON public.events
  FOR UPDATE USING (
    public.is_admin() OR created_by = public.my_person_id()
  );

CREATE POLICY "events_delete" ON public.events
  FOR DELETE USING (
    public.is_admin() OR created_by = public.my_person_id()
  );

-- ── EVENT PARTICIPANTS ────────────────────────
CREATE POLICY "participants_select" ON public.event_participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "participants_all" ON public.event_participants
  FOR ALL USING (public.is_admin() OR public.my_person_id() IS NOT NULL);

-- ── VACATION ENTRIES ──────────────────────────
-- Tutti vedono le ferie di tutti (per il report disponibilità)
CREATE POLICY "vacations_select" ON public.vacation_entries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Ognuno inserisce/modifica le proprie; admin può fare tutto
CREATE POLICY "vacations_insert" ON public.vacation_entries
  FOR INSERT WITH CHECK (
    public.is_admin() OR person_id = public.my_person_id()
  );

CREATE POLICY "vacations_update" ON public.vacation_entries
  FOR UPDATE USING (
    public.is_admin() OR person_id = public.my_person_id()
  );

CREATE POLICY "vacations_delete" ON public.vacation_entries
  FOR DELETE USING (
    public.is_admin() OR person_id = public.my_person_id()
  );

-- ── GEMBA ENTRIES ─────────────────────────────
CREATE POLICY "gemba_select" ON public.gemba_entries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "gemba_all" ON public.gemba_entries
  FOR ALL USING (public.is_admin());

-- ── SETTINGS ──────────────────────────────────
CREATE POLICY "settings_select" ON public.settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "settings_all" ON public.settings
  FOR ALL USING (public.is_admin());
