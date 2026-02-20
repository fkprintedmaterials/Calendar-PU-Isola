# 📅 Calendar Impegni PU Isola

Tool di gestione calendario management — ferie, eventi, gemba walk, disponibilità team.

## Stack
- **Frontend:** React 18 + Vite
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel
- **Stato:** Zustand

---

## ⚡ Setup iniziale (una tantum, ~20 minuti)

### 1. Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un account
2. **New Project** → dai un nome (es. `calendar-pu-isola`)
3. Scegli la region più vicina (es. `West EU`)
4. Vai su **SQL Editor** e incolla ed esegui nell'ordine:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_rls.sql`
   - `supabase/migrations/003_seed.sql`
5. Vai su **Settings → API** e copia:
   - `Project URL`
   - `anon / public` key

### 2. File di configurazione locale

```bash
cp .env.example .env.local
```

Apri `.env.local` e incolla i valori copiati da Supabase:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. GitHub

1. Crea un nuovo repository su [github.com](https://github.com) (es. `calendar-pu-isola`)
2. Dal terminale nella cartella del progetto:

```bash
git init
git add .
git commit -m "feat: Fase 1 - calendario base"
git remote add origin https://github.com/TUO_USERNAME/calendar-pu-isola.git
git push -u origin main
```

### 4. Vercel

1. Vai su [vercel.com](https://vercel.com) → **Add New Project**
2. Importa il repository GitHub appena creato
3. In **Environment Variables** aggiungi:
   - `VITE_SUPABASE_URL` → il tuo Project URL
   - `VITE_SUPABASE_ANON_KEY` → la tua anon key
4. Clicca **Deploy** → in ~30 secondi l'app è online

---

## 👥 Aggiungere utenti

1. Supabase → **Authentication → Users → Invite User**
2. Inserisci l'email del collega
3. Il collega riceve un'email con link per impostare la password
4. Dopo l'accettazione, collega l'utente alla persona:

```sql
UPDATE public.persons
SET auth_user_id = 'uuid-da-authentication'
WHERE name = 'Nanni';
```

Trovi l'UUID nella lista utenti di Supabase Auth.

---

## 🖼 Caricare il logo aziendale

1. Supabase → **Storage** → crea un bucket pubblico `assets`
2. Carica il file `logo.png`
3. Copia l'URL pubblico
4. Aggiorna il setting:

```sql
UPDATE public.settings
SET value = '"https://xxxx.supabase.co/storage/v1/object/public/assets/logo.png"'
WHERE key = 'logo_url';
```

---

## 💻 Sviluppo locale

```bash
npm install
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

---

## 🗺 Roadmap

| Fase | Contenuto | Stato |
|------|-----------|-------|
| 1 | Layout + Auth + Calendario base + Festivi | ✅ Completata |
| 2 | Ferie (ore, target, report) | 🔜 |
| 3 | Import Excel | 🔜 |
| 4 | Report Disponibilità + Heatmap | 🔜 |
| 5 | Vista Settimana / Giorno + Realtime | 🔜 |
| 6 | Anagrafiche + Gerarchia | 🔜 |
| 7 | Gemba Walk avanzato | 🔜 |
