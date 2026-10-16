import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/auth-context'
import { FormField } from '@/components/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/api'
import { signUpSchema, type SignUpValues } from '@/lib/validation'
import { AuthLayout } from './AuthLayout'

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema), mode: 'onTouched' })

  const onSubmit = async (values: SignUpValues) => {
    setServerError(null)
    try {
      await signUp(values)
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>It only takes a minute to get started.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            <FormField label="Name" autoComplete="name" error={errors.name} {...register('name')} />
            <FormField label="Email" type="email" autoComplete="email" error={errors.email} {...register('email')} />
            <FormField
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password}
              {...register('password')}
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters, including a letter, a number and a special character.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Sign up'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already a member?{' '}
              <Link to="/signin" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  )
}
