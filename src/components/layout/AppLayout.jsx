import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main style={{
        marginTop: 'var(--header-h)',
        marginLeft: 'var(--sidebar-w)',
        minHeight: 'calc(100vh - var(--header-h))',
        padding: '28px 32px',
        background: 'var(--bg)',
      }}>
        {children}
      </main>
    </>
  )
}
