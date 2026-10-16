import { useId, type ComponentProps } from 'react'
import type { FieldError } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props extends ComponentProps<typeof Input> {
  label: string
  error?: FieldError
}

export function FormField({ label, error, ref, ...props }: Props) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
