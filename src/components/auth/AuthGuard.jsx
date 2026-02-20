import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function AuthGuard({ children }) {
  const { session, loading, init } = useAuthStore()

  useEffect(() => { init() }, [])

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg)',
      fontFamily: 'var(--font-display)', color: 'var(--text-3)', fontSize: 14,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{
          width: 32, height: 32, border: '3px solid var(--border)',
          borderTopColor: 'var(--navy)', borderRadius: '50%',
          animation: 'spin .7s linear infinite', margin: '0 auto 12px',
        }} />
        Caricamento…
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (!session) return <Navigate to="/login" replace />

  return children
}
