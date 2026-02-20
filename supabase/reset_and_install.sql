-- ══════════════════════════════════════════════════════════════
--  RESET COMPLETO + INSTALLAZIONE
--  Calendar PU Isola – v2 (no-auth + audit log)
--
--  Supabase → SQL Editor → incolla tutto → Run
-- ══════════════════════════════════════════════════════════════

-- 1. ELIMINA TUTTO
DROP TABLE IF EXISTS public.audit_log          CASCADE;
DROP TABLE IF EXISTS public.gemba_entries      CASCADE;
DROP TABLE IF EXISTS public.vacation_entries   CASCADE;
DROP TABLE IF EXISTS public.event_participants CASCADE;
DROP TABLE IF EXISTS public.events             CASCADE;
DROP TABLE IF EXISTS public.event_types        CASCADE;
DROP TABLE IF EXISTS public.persons            CASCADE;
DROP TABLE IF EXISTS public.settings           CASCADE;
DROP FUNCTION IF EXISTS public.is_admin()      CASCADE;
DROP FUNCTION IF EXISTS public.my_person_id()  CASCADE;

-- 2. CREA LE TABELLE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.persons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  role              TEXT,
  department        TEXT,
  color             TEXT DEFAULT '#6b7280',
  manager_id        UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  vacation_target_h NUMERIC DEFAULT 160,
  is_admin          BOOLEAN DEFAULT FALSE,
  active            BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_types (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  color               TEXT NOT NULL DEFAULT '#6b7280',
  icon                TEXT DEFAULT '●',
  blocks_availability BOOLEAN DEFAULT TRUE,
  sort_order          INT DEFAULT 0
);

CREATE TABLE public.events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  event_type_id UUID REFERENCES public.event_types(id) ON DELETE SET NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE TABLE public.event_participants (
  event_id  UUID NOT NULL REFERENCES public.events(id)  ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, person_id)
);

CREATE TABLE public.vacation_entries (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id  UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  hours      NUMERIC NOT NULL CHECK (hours > 0 AND hours <= 8),
  type       TEXT NOT NULL DEFAULT 'ferie'
             CHECK (type IN ('ferie','smart','trasferta','permesso')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (person_id, date, type)
);

CREATE TABLE public.gemba_entries (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date    DATE NOT NULL,
  area    TEXT NOT NULL,
  slt1_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  slt2_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  topic   TEXT,
  UNIQUE (date, area)
);

CREATE TABLE public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  table_name  TEXT NOT NULL,
  record_id   UUID,
  description TEXT,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 3. INDICI
CREATE INDEX idx_events_dates     ON public.events(start_date, end_date);
CREATE INDEX idx_vacations_person ON public.vacation_entries(person_id, date);
CREATE INDEX idx_audit_time       ON public.audit_log(created_at DESC);

-- 4. PERMESSI APERTI (nessun login richiesto)
ALTER TABLE public.persons            DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_entries   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gemba_entries      DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings           DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.persons            TO anon;
GRANT ALL ON public.event_types        TO anon;
GRANT ALL ON public.events             TO anon;
GRANT ALL ON public.event_participants TO anon;
GRANT ALL ON public.vacation_entries   TO anon;
GRANT ALL ON public.gemba_entries      TO anon;
GRANT ALL ON public.audit_log          TO anon;
GRANT ALL ON public.settings           TO anon;

-- 5. DATI INIZIALI
INSERT INTO public.event_types (name, color, icon, blocks_availability, sort_order) VALUES
  ('Ferie',               '#059669', '🌴', TRUE,  1),
  ('Gemba Walk',          '#2563eb', '🦶', TRUE,  2),
  ('Audit',               '#ea580c', '🔍', TRUE,  3),
  ('Visita Esterna',      '#7c3aed', '👥', TRUE,  4),
  ('Fermata Produttiva',  '#dc2626', '⛔', TRUE,  5),
  ('Workshop / S&OP',     '#d97706', '🗂', TRUE,  6),
  ('FAT / IOQ',           '#0891b2', '🔬', TRUE,  7),
  ('Chiusura Controlling','#6b7280', '📋', FALSE,  8);

INSERT INTO public.settings (key, value) VALUES
  ('app_title',             '"Calendar Impegni PU Isola"'),
  ('logo_url',              'null'),
  ('working_hours_lun_gio', '8'),
  ('working_hours_ven',     '7'),
  ('local_holidays',        '[]'),
  ('current_year',          '2026');

INSERT INTO public.persons (name, role, department, color, vacation_target_h, active) VALUES
  ('Nanni',    'Plant Director', 'Direzione',    '#1e40af', 160, TRUE),
  ('Dumitru',  'Manager',        'Operations',   '#7c3aed', 160, TRUE),
  ('Chicconi', 'Manager',        'Quality',      '#0891b2', 160, TRUE),
  ('Mancuso',  'Manager',        'Engineering',  '#059669', 160, TRUE),
  ('Merzi',    'Manager',        'Maintenance',  '#d97706', 160, TRUE),
  ('Previero', 'Manager',        'Production',   '#dc2626', 160, TRUE),
  ('Falsiroli','Manager',        'Logistics',    '#6b7280', 160, TRUE),
  ('Rossi',    'Manager',        'HSE',          '#ea580c', 160, TRUE),
  ('Sereni',   'Manager',        'HR',           '#be185d', 160, TRUE),
  ('Tittonel', 'Manager',        'Finance',      '#065f46', 160, TRUE),
  ('Tognetti', 'Specialist',     'Quality',      '#4338ca', 160, TRUE),
  ('Veghini',  'Manager',        'Supply Chain', '#92400e', 160, TRUE),
  ('Viganò',   'Manager',        'IT',           '#1e3a5f', 160, TRUE);
