import { z } from 'zod'

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email address')

export const signUpSchema = z.object({
  email,
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9\s]/, 'Password must contain at least one special character'),
})

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})

export type SignUpValues = z.infer<typeof signUpSchema>
export type SignInValues = z.infer<typeof signInSchema>
