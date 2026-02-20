import { useSettingsStore } from '../../store/settingsStore'

export default function Header() {
  const { settings } = useSettingsStore()
  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, height:'var(--header-h)', zIndex:100,
      display:'flex', alignItems:'center', background:'var(--navy)',
      borderBottom:'1px solid rgba(255,255,255,.08)', boxShadow:'0 2px 8px rgba(0,0,0,.2)',
      padding:'0 24px 0 0',
    }}>
      <div style={{
        width:'var(--sidebar-w)', display:'flex', alignItems:'center',
        gap:10, padding:'0 20px', flexShrink:0, borderRight:'1px solid rgba(255,255,255,.08)',
      }}>
        {settings.logo_url
          ? <img src={settings.logo_url} alt="Logo" style={{ height:30, objectFit:'contain' }} />
          : <div style={{
              width:34, height:34, borderRadius:8, flexShrink:0,
              background:'linear-gradient(135deg,#d97706,#f59e0b)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, fontWeight:700, color:'#fff',
              boxShadow:'0 2px 8px rgba(217,119,6,.4)',
            }}>PU</div>
        }
      </div>
      <div style={{
        flex:1, textAlign:'center',
        fontFamily:'var(--font-display)', fontSize:15, fontWeight:600,
        letterSpacing:'.03em', color:'#fff',
      }}>
        {settings.app_title || 'Calendar Impegni PU Isola'}
      </div>
    </header>
  )
}
