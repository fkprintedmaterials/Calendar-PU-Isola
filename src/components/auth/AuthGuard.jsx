import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function AuthGuard({ children }) {
  const { loading, init } = useAuthStore()
  useEffect(() => { init() }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', color:'var(--text-3)', fontSize:14 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:32, height:32, border:'3px solid var(--border)', borderTopColor:'var(--amber)', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }} />
        Caricamento…
      </div>
    </div>
  )
  return children
}
