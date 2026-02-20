import { supabase } from './supabase'

async function getClientIp() {
  try {
    const r = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) })
    const { ip } = await r.json()
    return ip || null
  } catch { return null }
}

export async function writeAudit({ action, tableName, recordId, description, oldData, newData }) {
  try {
    const ip = await getClientIp()
    await supabase.from('audit_log').insert({
      action, table_name: tableName, record_id: recordId || null,
      description: description || null,
      old_data: oldData || null, new_data: newData || null,
      ip_address: ip, user_agent: navigator.userAgent || null,
    })
  } catch (e) { console.warn('Audit:', e) }
}
