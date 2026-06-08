import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateContactForm,
} from './validation'

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true })
  })

  it('rejects an empty string', () => {
    const result = validateEmail('')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toBe('Email is required')
  })

  it('rejects whitespace-only input', () => {
    expect(validateEmail('   ').valid).toBe(false)
  })

  it('rejects an address without @', () => {
    expect(validateEmail('notanemail').valid).toBe(false)
  })

  it('rejects an address without a domain', () => {
    expect(validateEmail('user@').valid).toBe(false)
  })

  it('rejects an address without a TLD', () => {
    expect(validateEmail('user@domain').valid).toBe(false)
  })
})

describe('validatePhone', () => {
  it('accepts a valid 10-digit number', () => {
    expect(validatePhone('5551234567')).toEqual({ valid: true })
  })

  it('accepts a formatted number', () => {
    expect(validatePhone('(555) 123-4567')).toEqual({ valid: true })
  })

  it('rejects an empty string', () => {
    const result = validatePhone('')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toBe('Phone number is required')
  })

  it('rejects a number with fewer than 10 digits', () => {
    expect(validatePhone('123456789').valid).toBe(false)
  })

  it('rejects a number with more than 10 digits', () => {
    expect(validatePhone('15551234567').valid).toBe(false)
  })
})

describe('validateRequired', () => {
  it('passes when a value is present', () => {
    expect(validateRequired('something', 'Field')).toEqual({ valid: true })
  })

  it('fails with a field-specific message when empty', () => {
    const result = validateRequired('', 'Name')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.error).toBe('Name is required')
  })

  it('fails for whitespace-only input', () => {
    expect(validateRequired('   ', 'Description').valid).toBe(false)
  })
})

describe('validateContactForm', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '5551234567',
    message: 'I need a quote please.',
  }

  it('returns no errors for valid data', () => {
    expect(validateContactForm(validData)).toEqual({})
  })

  it('returns all errors when all fields are empty', () => {
    const errors = validateContactForm({ name: '', email: '', phone: '', message: '' })
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.phone).toBeDefined()
    expect(errors.message).toBeDefined()
  })

  it('returns only the relevant error for a single invalid field', () => {
    const errors = validateContactForm({ ...validData, email: 'bad-email' })
    expect(errors.email).toBeDefined()
    expect(errors.name).toBeUndefined()
    expect(errors.phone).toBeUndefined()
    expect(errors.message).toBeUndefined()
  })
})
