import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

async function fillForm(overrides: Partial<{
  name: string
  email: string
  phone: string
  message: string
}> = {}) {
  const fields = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '5551234567',
    message: 'I need a quote.',
    ...overrides,
  }
  await userEvent.type(screen.getByLabelText('Name'), fields.name)
  await userEvent.type(screen.getByLabelText('Email'), fields.email)
  await userEvent.type(screen.getByLabelText('Phone'), fields.phone)
  await userEvent.type(screen.getByLabelText('Message'), fields.message)
}

describe('ContactForm', () => {
  it('renders all fields and the submit button', () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
  })

  it('shows validation errors when submitted with empty fields', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findAllByRole('alert')).toHaveLength(4)
  })

  it('clears a field error when the user types in that field', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    await screen.findByText('Name is required')
    await userEvent.type(screen.getByLabelText('Name'), 'A')
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
  })

  it('calls onSubmit with form data when all fields are valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ContactForm onSubmit={handleSubmit} />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledOnce())
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '5551234567',
      message: 'I need a quote.',
    })
  })

  it('does not call onSubmit when validation fails', async () => {
    const handleSubmit = vi.fn()
    render(<ContactForm onSubmit={handleSubmit} />)
    await fillForm({ email: 'not-an-email' })
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('shows the success message after a successful submission', async () => {
    render(<ContactForm onSubmit={vi.fn().mockResolvedValue(undefined)} />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByRole('status')).toHaveTextContent("Thank you! We'll be in touch soon.")
  })

  it('disables the button while submitting', async () => {
    let resolve!: () => void
    const handleSubmit = vi.fn().mockReturnValue(new Promise<void>((r) => (resolve = r)))
    render(<ContactForm onSubmit={handleSubmit} />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(screen.getByRole('button')).toBeDisabled()
    resolve()
  })
})
