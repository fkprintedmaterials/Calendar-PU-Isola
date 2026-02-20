-- ══════════════════════════════════════════════
--  003_seed.sql  –  Dati iniziali
--  Persone dal file Excel originale + tipi evento
-- ══════════════════════════════════════════════

-- ─── TIPI EVENTO ─────────────────────────────
INSERT INTO public.event_types (name, color, icon, blocks_availability, sort_order) VALUES
  ('Ferie',             '#059669', '🌴', TRUE,  1),
  ('Gemba Walk',        '#2563eb', '🦶', TRUE,  2),
  ('Audit',             '#ea580c', '🔍', TRUE,  3),
  ('Visita Esterna',    '#7c3aed', '👥', TRUE,  4),
  ('Fermata Produttiva','#dc2626', '⛔', TRUE,  5),
  ('Workshop / S&OP',   '#d97706', '🗂', TRUE,  6),
  ('FAT / IOQ',         '#0891b2', '🔬', TRUE,  7),
  ('Chiusura Controlling','#6b7280','📋',FALSE, 8)
ON CONFLICT DO NOTHING;

-- ─── SETTINGS DEFAULT ────────────────────────
INSERT INTO public.settings (key, value) VALUES
  ('app_title',              '"Calendar Impegni PU Isola"'),
  ('logo_url',               'null'),
  ('working_hours_lun_gio',  '8'),
  ('working_hours_ven',      '7'),
  ('local_holidays',         '[]'),
  ('current_year',           '2026')
ON CONFLICT (key) DO NOTHING;

-- ─── PERSONE (dal file Excel) ─────────────────
-- NOTA: auth_user_id verrà collegato dopo la creazione degli utenti in Supabase Auth
-- Questi record consentono già di visualizzare i nomi nel calendario

INSERT INTO public.persons (name, role, department, color, vacation_target_h, is_admin, active)
VALUES
  ('Nanni',    'Plant Director',    'Direzione',    '#1e40af', 160, TRUE,  TRUE),
  ('Dumitru',  'Manager',           'Operations',   '#7c3aed', 160, FALSE, TRUE),
  ('Chicconi', 'Manager',           'Quality',      '#0891b2', 160, FALSE, TRUE),
  ('Mancuso',  'Manager',           'Engineering',  '#059669', 160, FALSE, TRUE),
  ('Merzi',    'Manager',           'Maintenance',  '#d97706', 160, FALSE, TRUE),
  ('Previero', 'Manager',           'Production',   '#dc2626', 160, FALSE, TRUE),
  ('Falsiroli','Manager',           'Logistics',    '#6b7280', 160, FALSE, TRUE),
  ('Rossi',    'Manager',           'HSE',          '#ea580c', 160, FALSE, TRUE),
  ('Sereni',   'Manager',           'HR',           '#be185d', 160, FALSE, TRUE),
  ('Tittonel', 'Manager',           'Finance',      '#065f46', 160, FALSE, TRUE),
  ('Tognetti', 'Specialist',        'Quality',      '#4338ca', 160, FALSE, TRUE),
  ('Veghini',  'Manager',           'Supply Chain', '#92400e', 160, FALSE, TRUE),
  ('Viganò',   'Manager',           'IT',           '#1e3a5f', 160, FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- ─── ISTRUZIONI POST-SEED ────────────────────
-- 1. Vai su Supabase → Authentication → Users → Invite user
-- 2. Per ogni persona, invita la email aziendale
-- 3. Dopo che l'utente ha accettato l'invito, collega l'auth_user_id:
--
--    UPDATE public.persons
--    SET auth_user_id = '<uuid-da-auth.users>'
--    WHERE name = 'Nanni';
--
-- 4. Per assegnare i ruoli gerarchici (es. Nanni è il capo di tutti):
--    UPDATE public.persons
--    SET manager_id = (SELECT id FROM public.persons WHERE name = 'Nanni')
--    WHERE name IN ('Dumitru','Chicconi','Mancuso','Merzi','Previero',
--                   'Falsiroli','Rossi','Sereni','Tittonel','Tognetti',
--                   'Veghini','Viganò');
