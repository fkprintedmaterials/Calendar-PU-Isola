import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { signIn } from '../lib/auth'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const { session } = useAuthStore()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(217,119,6,.06) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(24,36,58,.06) 0%, transparent 60%)
      `,
    }}>
      <div className="animate-scale" style={{ width: 400, maxWidth: '90vw' }}>

        {/* Logo + titolo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--amber) 0%, #f59e0b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(217,119,6,.3)',
          }}>
            PU
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
            color: 'var(--text)', marginBottom: 4,
          }}>
            Calendar Impegni
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>PU Isola</div>
        </div>

        {/* Card login */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '28px 32px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: 'var(--text)' }}>
            Accedi al tuo account
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label>Email aziendale</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="nome@azienda.it" required autoFocus
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5',
                borderRadius: 'var(--r-sm)', padding: '8px 12px',
                color: '#b91c1c', fontSize: 12,
              }}>
                {error === 'Invalid login credentials'
                  ? 'Email o password non corretti.'
                  : error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: 4, padding: '10px 16px', fontSize: 14 }}
            >
              {loading ? 'Accesso in corso…' : 'Accedi →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>
          Se non hai ancora un account, contatta l'amministratore.
        </div>
      </div>
    </div>
  )
}
