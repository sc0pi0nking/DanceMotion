import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}
if (!supabaseServiceKey && typeof window === 'undefined') {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

// Client für Browser (mit RLS)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

// Server Client (mit Service Role für API Routes)
export const supabaseServer = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Types
export interface Event {
  id: string
  title: string
  date: string // ISO date
  time?: string // HH:mm
  location: string
  city: string
  category: 'Auftritt' | 'Workshop' | 'Training' | 'Event'
  groups?: string[]
  note?: string
  href?: string
  created_at: string
  updated_at: string
  updated_by?: string
  is_published: boolean
}

export interface ContentItem {
  id: string
  key: string
  value: Record<string, any>
  section: string
  description?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface GalleryItem {
  id: string
  title: string
  category: string
  description?: string
  images: Array<{
    url: string
    alt?: string
    caption?: string
  }>
  is_published: boolean
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface FormItem {
  id: string
  name: string
  slug: string
  type: 'membership' | 'contact' | 'newsletter'
  description?: string
  fields: Array<{
    id: string
    name: string
    label: string
    type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox'
    required?: boolean
    options?: string[]
  }>
  is_active: boolean
  redirect_url?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface FormSubmission {
  id: string
  form_id: string
  data: Record<string, any>
  email?: string
  status: 'new' | 'read' | 'archived'
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: 'admin' | 'editor'
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
