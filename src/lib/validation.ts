export type ValidationResult = { valid: true } | { valid: false; error: string }

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') return { valid: false, error: 'Email is required' }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email)) return { valid: false, error: 'Invalid email address' }
  return { valid: true }
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') return { valid: false, error: 'Phone number is required' }
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return { valid: false, error: 'Phone number must be 10 digits' }
  return { valid: true }
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: `${fieldName} is required` }
  return { valid: true }
}

export type ContactFormData = {
  name: string
  email: string
  phone: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  const nameResult = validateRequired(data.name, 'Name')
  if (!nameResult.valid) errors.name = nameResult.error

  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) errors.email = emailResult.error

  const phoneResult = validatePhone(data.phone)
  if (!phoneResult.valid) errors.phone = phoneResult.error

  const messageResult = validateRequired(data.message, 'Message')
  if (!messageResult.valid) errors.message = messageResult.error

  return errors
}
