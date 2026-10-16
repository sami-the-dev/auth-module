import { signInSchema, signUpSchema } from './validation'

const valid = { email: 'jane@example.com', name: 'Jane', password: 'secret123!' }

describe('signUpSchema', () => {
  it('accepts valid input', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })
  it.each([
    ['invalid email', { email: 'nope' }],
    ['short name', { name: 'ab' }],
    ['short password', { password: 'a1!' }],
    ['no letter', { password: '12345678!' }],
    ['no number', { password: 'abcdefgh!' }],
    ['no special character', { password: 'abcdefg1' }],
  ])('rejects %s', (_label, override) => {
    expect(signUpSchema.safeParse({ ...valid, ...override }).success).toBe(false)
  })
})

describe('signInSchema', () => {
  it('requires email and password', () => {
    expect(signInSchema.safeParse({ email: '', password: '' }).success).toBe(false)
    expect(signInSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true)
  })
})
