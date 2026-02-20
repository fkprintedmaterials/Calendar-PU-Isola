import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'

export default function Header() {
  const { person, signOut } = useAuthStore()
  const { settings } = useSettingsStore()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--header-h)', zIndex: 100,
      display: 'flex', alignItems: 'center',
      background: 'var(--navy)',
      borderBottom: '1px solid rgba(255,255,255,.08)',
      boxShadow: '0 1px 0 rgba(0,0,0,.2)',
      padding: '0 20px 0 0',
    }}>
      {/* Logo area – width uguale alla sidebar */}
      <div style={{
        width: 'var(--sidebar-w)',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 20px',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,.08)',
      }}>
        {settings.logo_url
          ? <img src={settings.logo_url} alt="Logo" style={{ height: 30, objectFit: 'contain' }} />
          : <LogoPlaceholder />
        }
      </div>

      {/* Titolo centrale */}
      <div style={{
        flex: 1, textAlign: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: 15, fontWeight: 600, letterSpacing: '.03em',
        color: '#ffffff',
      }}>
        {settings.app_title || 'Calendar Impegni PU Isola'}
      </div>

      {/* User area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 'var(--r-sm)',
          background: 'rgba(255,255,255,.08)',
        }}>
          <Avatar name={person?.name || '?'} color={person?.color} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
              {person?.name || '—'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--navy-muted)' }}>
              {person?.role || ''}
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,.15)',
            color: 'rgba(255,255,255,.6)', borderRadius: 'var(--r-sm)',
            padding: '5px 10px', fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,.08)'; e.target.style.color = '#fff' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,.6)' }}
          title="Esci"
        >
          ⏏ Esci
        </button>
      </div>
    </header>
  )
}

function Avatar({ name, color }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: color || '#d97706',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700, color: '#fff',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function LogoPlaceholder() {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 8,
      background: 'linear-gradient(135deg, var(--amber) 0%, #f59e0b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, fontWeight: 700, color: '#fff',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(217,119,6,.4)',
    }}>
      PU
    </div>
  )
}
