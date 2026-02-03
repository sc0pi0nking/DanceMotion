import { SystemSettings, DEFAULT_SETTINGS } from './settings'

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validates a password against system requirements
 */
export function validatePassword(
  password: string,
  settings: Partial<SystemSettings> = {}
): PasswordValidationResult {
  const minLength = settings.min_password_length ?? DEFAULT_SETTINGS.min_password_length
  const requireSpecialChars = settings.require_special_chars ?? DEFAULT_SETTINGS.require_special_chars

  const errors: string[] = []

  // Check minimum length
  if (password.length < minLength) {
    errors.push(`Passwort muss mindestens ${minLength} Zeichen lang sein`)
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Großbuchstaben enthalten')
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Kleinbuchstaben enthalten')
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    errors.push('Passwort muss mindestens eine Zahl enthalten')
  }

  // Check for special characters if required
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Passwort muss mindestens ein Sonderzeichen enthalten (!@#$%^&*...)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get password requirements description for UI
 */
export function getPasswordRequirements(
  settings: Partial<SystemSettings> = {}
): string[] {
  const minLength = settings.min_password_length ?? DEFAULT_SETTINGS.min_password_length
  const requireSpecialChars = settings.require_special_chars ?? DEFAULT_SETTINGS.require_special_chars

  const requirements = [
    `Mindestens ${minLength} Zeichen`,
    'Mindestens ein Großbuchstabe',
    'Mindestens ein Kleinbuchstabe',
    'Mindestens eine Zahl',
  ]

  if (requireSpecialChars) {
    requirements.push('Mindestens ein Sonderzeichen (!@#$%^&*...)')
  }

  return requirements
}
