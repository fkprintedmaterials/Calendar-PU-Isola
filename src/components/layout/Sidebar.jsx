import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { section: 'Principale' },
  { to: '/',        icon: '📅', label: 'Calendario' },
  { to: '/report',  icon: '📊', label: 'Disponibilità' },
  { section: 'Gestione' },
  { to: '/ferie',   icon: '🌴', label: 'Ferie' },
  { to: '/gemba',   icon: '🦶', label: 'Gemba Walk' },
  { to: '/eventi',  icon: '🔔', label: 'Eventi' },
  { section: 'Impostazioni' },
  { to: '/anagrafiche', icon: '👥', label: 'Anagrafiche', adminOnly: true },
  { to: '/gerarchia',   icon: '🏗', label: 'Gerarchia',   adminOnly: true },
  { to: '/import',      icon: '📥', label: 'Import Excel', adminOnly: true },
]

export default function Sidebar() {
  const { isAdmin } = useAuthStore()
  const admin = isAdmin()

  return (
    <aside style={{
      position: 'fixed', top: 'var(--header-h)', left: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'var(--navy)',
      borderRight: '1px solid rgba(255,255,255,.06)',
      overflowY: 'auto',
      padding: '12px 10px',
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      {navItems.map((item, i) => {
        if (item.section) return (
          <div key={i} style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,.25)',
            padding: '14px 10px 4px',
            fontFamily: 'var(--font-mono)',
          }}>
            {item.section}
          </div>
        )
        if (item.adminOnly && !admin) return null
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              textDecoration: 'none',
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,.5)',
              background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
              transition: 'all .15s',
              position: 'relative',
            })}
            onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
            onMouseLeave={e => { if (!e.currentTarget.style.background.includes('.1)')) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        )
      })}

      {/* Footer sidebar */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          v1.0 · Fase 1
        </div>
      </div>
    </aside>
  )
}
