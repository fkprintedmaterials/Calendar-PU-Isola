import { NavLink } from 'react-router-dom'

const nav = [
  { section:'Principale' },
  { to:'/',       icon:'📅', label:'Calendario' },
  { to:'/report', icon:'📊', label:'Disponibilità' },
  { section:'Gestione' },
  { to:'/ferie',  icon:'🌴', label:'Ferie' },
  { to:'/gemba',  icon:'🦶', label:'Gemba Walk' },
  { to:'/eventi', icon:'🔔', label:'Eventi' },
  { section:'Amministrazione' },
  { to:'/audit',       icon:'📋', label:'Audit Log' },
  { to:'/anagrafiche', icon:'👥', label:'Anagrafiche' },
  { to:'/gerarchia',   icon:'🏗',  label:'Gerarchia' },
  { to:'/import',      icon:'📥', label:'Import Excel' },
]

export default function Sidebar() {
  return (
    <aside style={{
      position:'fixed', top:'var(--header-h)', left:0, bottom:0,
      width:'var(--sidebar-w)', background:'var(--navy)',
      borderRight:'1px solid rgba(255,255,255,.06)',
      overflowY:'auto', padding:'12px 10px',
      display:'flex', flexDirection:'column', gap:2,
    }}>
      {nav.map((item, i) => {
        if (item.section) return (
          <div key={i} style={{
            fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase',
            color:'rgba(255,255,255,.25)', padding:'14px 10px 4px', fontFamily:'var(--font-mono)',
          }}>{item.section}</div>
        )
        return (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:9, padding:'8px 12px',
              borderRadius:'var(--r-sm)', textDecoration:'none', fontSize:13,
              fontWeight: isActive ? 600 : 400,
              color:      isActive ? '#fff' : 'rgba(255,255,255,.5)',
              background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
              transition:'all .15s',
            })}
          >
            <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
          </NavLink>
        )
      })}
      <div style={{ marginTop:'auto', paddingTop:16, borderTop:'1px solid rgba(255,255,255,.06)', textAlign:'center' }}>
        <div style={{ fontSize:10, color:'rgba(255,255,255,.2)', fontFamily:'var(--font-mono)' }}>v2.0 · Fase 1+2</div>
      </div>
    </aside>
  )
}
