import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

const passwordSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const magicSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

type PasswordForm = z.infer<typeof passwordSchema>
type MagicForm = z.infer<typeof magicSchema>

export function LoginPage() {
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [magicSent, setMagicSent] = useState(false)
  const { login, sendLink } = useAuth()

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: '', password: '' },
  })

  const magicForm = useForm<MagicForm>({
    resolver: zodResolver(magicSchema),
    defaultValues: { email: '' },
  })

  async function onPasswordSubmit(values: PasswordForm) {
    try {
      await login(values.email, values.password)
    } catch {
      toast.error('Invalid email or password')
    }
  }

  async function onMagicSubmit(values: MagicForm) {
    try {
      await sendLink(values.email)
      setMagicSent(true)
    } catch {
      toast.error('Failed to send magic link. Please try again.')
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {mode === 'password' ? 'Sign in' : 'Magic link'}
        </CardTitle>
        <CardDescription>
          {mode === 'password'
            ? 'Enter your credentials to access your tracker'
            : 'Get a one-click sign-in link sent to your email'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'password' ? (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...passwordForm.register('email')}
              />
              {passwordForm.formState.errors.email && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...passwordForm.register('password')}
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        ) : magicSent ? (
          <div className="py-4 text-center space-y-2">
            <p className="text-3xl">📬</p>
            <p className="font-medium">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              We sent a magic link to{' '}
              <strong>{magicForm.getValues('email')}</strong>
            </p>
            <Button variant="ghost" size="sm" onClick={() => setMagicSent(false)}>
              Try a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={magicForm.handleSubmit(onMagicSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="magic-email">Email</Label>
              <Input
                id="magic-email"
                type="email"
                placeholder="you@example.com"
                {...magicForm.register('email')}
              />
              {magicForm.formState.errors.email && (
                <p className="text-xs text-destructive">{magicForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={magicForm.formState.isSubmitting}
            >
              {magicForm.formState.isSubmitting ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setMagicSent(false) }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            {mode === 'password' ? 'Use magic link instead' : 'Use password instead'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
