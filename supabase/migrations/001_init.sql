-- ══════════════════════════════════════════════
--  001_init.sql  –  Calendar PU Isola
--  Crea tutte le tabelle del database
-- ══════════════════════════════════════════════

-- Abilita UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PERSONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.persons (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  role             TEXT,
  department       TEXT,
  email            TEXT,
  color            TEXT DEFAULT '#6b7280',  -- hex colore avatar
  manager_id       UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  vacation_target_h NUMERIC DEFAULT 160,    -- ore ferie target annue
  is_admin         BOOLEAN DEFAULT FALSE,
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EVENT TYPES ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_types (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  color               TEXT NOT NULL DEFAULT '#6b7280',
  icon                TEXT DEFAULT '●',
  blocks_availability BOOLEAN DEFAULT TRUE,  -- blocca il giorno nel report disponibilità
  sort_order          INT DEFAULT 0
);

-- ─── EVENTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  event_type_id  UUID REFERENCES public.event_types(id) ON DELETE SET NULL,
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  notes          TEXT,
  created_by     UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ─── EVENT PARTICIPANTS ───────────────────────
CREATE TABLE IF NOT EXISTS public.event_participants (
  event_id   UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  person_id  UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, person_id)
);

-- ─── VACATION ENTRIES ─────────────────────────
CREATE TABLE IF NOT EXISTS public.vacation_entries (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id  UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  hours      NUMERIC NOT NULL CHECK (hours > 0 AND hours <= 8),
  type       TEXT NOT NULL DEFAULT 'ferie'
             CHECK (type IN ('ferie','smart','trasferta','permesso')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (person_id, date, type)   -- evita duplicati stesso giorno/tipo
);

-- ─── GEMBA ENTRIES ───────────────────────────
CREATE TABLE IF NOT EXISTS public.gemba_entries (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date     DATE NOT NULL,
  area     TEXT NOT NULL,
  slt1_id  UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  slt2_id  UUID REFERENCES public.persons(id) ON DELETE SET NULL,
  topic    TEXT,
  UNIQUE (date, area)
);

-- ─── SETTINGS ─────────────────────────────────
-- Tabella key-value per configurazioni globali
CREATE TABLE IF NOT EXISTS public.settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL
);

-- Indici utili
CREATE INDEX IF NOT EXISTS idx_events_dates       ON public.events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_vacations_person   ON public.vacation_entries(person_id, date);
CREATE INDEX IF NOT EXISTS idx_participants_event ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_person ON public.event_participants(person_id);
