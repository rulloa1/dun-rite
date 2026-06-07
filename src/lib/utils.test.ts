import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPhoneNumber, slugify, truncate } from './utils'

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(1000)).toBe('$10.00')
  })

  it('formats cents correctly', () => {
    expect(formatCurrency(999)).toBe('$9.99')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large amounts', () => {
    expect(formatCurrency(100000)).toBe('$1,000.00')
  })
})

describe('formatPhoneNumber', () => {
  it('formats a plain 10-digit number', () => {
    expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
  })

  it('strips non-digit characters before formatting', () => {
    expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567')
    expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
  })

  it('throws for numbers shorter than 10 digits', () => {
    expect(() => formatPhoneNumber('12345')).toThrow('Phone number must be 10 digits')
  })

  it('throws for numbers longer than 10 digits', () => {
    expect(() => formatPhoneNumber('15551234567')).toThrow('Phone number must be 10 digits')
  })
})

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('collapses multiple spaces/hyphens', () => {
    expect(slugify('hello   world')).toBe('hello-world')
    expect(slugify('hello---world')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  hello world  ')).toBe('hello-world')
  })

  it('handles already-slugified strings', () => {
    expect(slugify('already-slugified')).toBe('already-slugified')
  })
})

describe('truncate', () => {
  it('returns the string unchanged when under the limit', () => {
    expect(truncate('short', 10)).toBe('short')
  })

  it('returns the string unchanged when exactly at the limit', () => {
    expect(truncate('exactly10!', 10)).toBe('exactly10!')
  })

  it('truncates and appends ellipsis when over the limit', () => {
    const result = truncate('This is a longer string', 10)
    expect(result.endsWith('…')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(11)
  })

  it('trims trailing whitespace before appending ellipsis', () => {
    expect(truncate('hello world', 6)).toBe('hello…')
  })
})
