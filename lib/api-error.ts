import { NextResponse } from 'next/server'
import { logger } from './logger'

/**
 * Centralized API error handling.
 *
 * Never leak internal error details (`error.message`, stack traces, SQL, …) to
 * clients. Full context is logged server-side via Pino; the client receives a
 * stable, generic message.
 */

const GENERIC_MESSAGE = 'Interner Serverfehler. Bitte später erneut versuchen.'

function serialize(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack }
  }
  return { value: error }
}

/**
 * Log the real error and return a generic 500 (or given status) JSON response.
 *
 * @param context  Short label for where the error occurred, e.g. "gallery.create".
 * @param error    The caught error (unknown).
 * @param status   HTTP status to return (default 500).
 */
export function serverError(
  context: string,
  error: unknown,
  status = 500
): NextResponse {
  logger.error({ context, err: serialize(error) }, `${context} failed`)
  return NextResponse.json({ error: GENERIC_MESSAGE }, { status })
}

/**
 * Return a client-safe validation / bad-request error. The message IS shown to
 * the client, so pass only non-sensitive, user-facing text.
 */
export function clientError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status })
}
