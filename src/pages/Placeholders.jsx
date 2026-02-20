function ComingSoon({ title, icon, fase, desc }) {
  return (
    <div className="animate-fade" style={{ maxWidth:500, margin:'60px auto', textAlign:'center' }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'48px 40px', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>{icon}</div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:600, marginBottom:8 }}>{title}</div>
        <div style={{ display:'inline-block', padding:'3px 10px', borderRadius:20, background:'var(--amber-bg)', color:'var(--amber)', fontSize:11, fontWeight:600, fontFamily:'var(--font-mono)', marginBottom:14 }}>{fase}</div>
        <div style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{desc}</div>
      </div>
    </div>
  )
}

export const GembaPage      = () => <ComingSoon title="Gemba Walk"          icon="🦶" fase="Fase 7"     desc="Pianificazione gemba settimanale per area e SLT." />
export const EventiPage     = () => <ComingSoon title="Gestione Eventi"     icon="🔔" fase="Prossima"   desc="Crea e gestisci audit, visite esterne, fermate produttive." />
export const ReportPage     = () => <ComingSoon title="Report Disponibilità"icon="📊" fase="Fase 4"     desc="Trova giornate libere per tutto il team." />
export const AnagrafichePage= () => <ComingSoon title="Anagrafiche"         icon="👥" fase="Fase 6"     desc="Gestione persone, ruoli, colori." />
export const GerarchiePage  = () => <ComingSoon title="Gerarchia"           icon="🏗"  fase="Fase 6"     desc="Struttura multi-livello con drill-down." />
export const ImportPage     = () => <ComingSoon title="Import Excel"        icon="📥" fase="Fase 3"     desc="Carica il file .xlsx per importare tutti i dati." />
