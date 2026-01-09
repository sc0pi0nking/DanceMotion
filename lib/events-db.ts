import { supabase } from './supabase'
import type { Event } from './supabase'

/**
 * Fetch all events from Supabase
 * Replaces the static lib/events.ts data
 */
export async function fetchAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

/**
 * Get upcoming events (future dates)
 */
export async function fetchUpcomingEvents(limit?: number): Promise<Event[]> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString().split('T')[0]

    let query = supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('date', todayISO)
      .order('date', { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching upcoming events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch upcoming events:', error)
    return []
  }
}

/**
 * Get past events (old dates)
 */
export async function fetchPastEvents(limit?: number): Promise<Event[]> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString().split('T')[0]

    let query = supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .lt('date', todayISO)
      .order('date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching past events:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch past events:', error)
    return []
  }
}

/**
 * Get a single event by ID
 */
export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return null
  }
}
