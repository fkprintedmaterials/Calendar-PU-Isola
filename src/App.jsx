import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

import AuthGuard from './components/auth/AuthGuard'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import CalendarPage from './pages/CalendarPage'
import {
  FeriePage, GembaPage, EventiPage,
  ReportPage, AnagrafichePage, GerarchiePage, ImportPage
} from './pages/Placeholders'

import { useSettingsStore } from './store/settingsStore'

function AppContent() {
  const { fetchSettings } = useSettingsStore()
  useEffect(() => { fetchSettings() }, [])

  return (
    <AppLayout>
      <Routes>
        <Route path="/"            element={<CalendarPage />} />
        <Route path="/ferie"       element={<FeriePage />} />
        <Route path="/gemba"       element={<GembaPage />} />
        <Route path="/eventi"      element={<EventiPage />} />
        <Route path="/report"      element={<ReportPage />} />
        <Route path="/anagrafiche" element={<AnagrafichePage />} />
        <Route path="/gerarchia"   element={<GerarchiePage />} />
        <Route path="/import"      element={<ImportPage />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <AuthGuard>
            <AppContent />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}
