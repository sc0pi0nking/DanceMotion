import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { fetchContentVersions, snapshotContentVersion } from '@/lib/content-versions'

// GET - Versionshistorie eines Content-Keys
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key } = await params
    const versions = await fetchContentVersions(key)
    return Response.json(versions)
  } catch (error: any) {
    console.error('GET content versions error:', error)
    return Response.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

// POST - Eine frühere Version wiederherstellen (Body: { versionId })
export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.CONTENT)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key } = await params
    const { versionId } = await req.json()

    if (!versionId) {
      return Response.json({ error: 'versionId erforderlich' }, { status: 400 })
    }

    // Ziel-Version laden und Zugehörigkeit zum Key prüfen
    const { data: version, error: versionError } = await supabaseServer
      .from('content_versions')
      .select('*')
      .eq('id', versionId)
      .eq('content_key', key)
      .single()

    if (versionError || !version) {
      return Response.json({ error: 'Version nicht gefunden' }, { status: 404 })
    }

    // Aktuellen Wert vor dem Wiederherstellen ebenfalls sichern
    await snapshotContentVersion(key)

    const { data, error } = await supabaseServer
      .from('content')
      .update({
        value: version.value,
        updated_at: new Date().toISOString(),
        updated_by: currentUser.email || 'system',
      })
      .eq('key', key)
      .select()

    if (error) throw error

    return Response.json({ success: true, data: data?.[0] })
  } catch (error: any) {
    console.error('Restore content version error:', error)
    return Response.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
