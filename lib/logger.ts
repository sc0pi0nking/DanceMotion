import pino from 'pino'

/**
 * Central structured logger (Pino).
 *
 * Node.js runtime only — do NOT import from Edge middleware.
 * Outputs newline-delimited JSON to stdout; ship/aggregate at the platform
 * level (Docker/Loki/etc.). Sensitive fields are redacted.
 */

const level =
  process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

export const logger = pino({
  level,
  base: { app: 'dancemotion-web' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.apikey',
      '*.api_key',
      '*.secret',
    ],
    remove: true,
  },
})

export default logger
