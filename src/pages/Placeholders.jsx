// src/pages/Placeholder.jsx
// Pagine placeholder per le fasi successive

export function FeriePage() {
  return <ComingSoon title="Ferie" icon="🌴" fase="Fase 2" desc="Inserimento ore ferie, target annuo per persona, report residuo." />
}
export function GembaPage() {
  return <ComingSoon title="Gemba Walk" icon="🦶" fase="Fase 7" desc="Pianificazione gemba settimanale per area e SLT." />
}
export function EventiPage() {
  return <ComingSoon title="Gestione Eventi" icon="🔔" fase="Fase 2" desc="Crea e gestisci audit, visite esterne, fermate produttive." />
}
export function ReportPage() {
  return <ComingSoon title="Report Disponibilità" icon="📊" fase="Fase 4" desc="Trova giornate libere per tutto il team e pianifica il team building." />
}
export function AnagrafichePage() {
  return <ComingSoon title="Anagrafiche" icon="👥" fase="Fase 6" desc="Gestione persone, ruoli, colori identificativi." />
}
export function GerarchiePage() {
  return <ComingSoon title="Struttura Gerarchica" icon="🏗" fase="Fase 6" desc="Albero capo → manager multi-livello con drill-down." />
}
export function ImportPage() {
  return <ComingSoon title="Import Excel" icon="📥" fase="Fase 3" desc="Carica il file .xlsx esistente per importare tutti i dati." />
}

function ComingSoon({ title, icon, fase, desc }) {
  return (
    <div className="animate-fade" style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', padding: '48px 40px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
          marginBottom: 8, color: 'var(--text)',
        }}>
          {title}
        </div>
        <div style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: 20,
          background: 'var(--amber-bg)', color: 'var(--amber)',
          fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
          marginBottom: 14,
        }}>
          {fase}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}
