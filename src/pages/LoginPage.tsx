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

// Google's official "G" mark (multi-color SVG)
function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  )
}

export function LoginPage() {
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [magicSent, setMagicSent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, sendLink, signInWithGoogle } = useAuth()

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Browser will redirect to Google — no further code runs here on success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start Google sign-in'
      toast.error(message)
      setGoogleLoading(false)
    }
  }

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
        {/* Google OAuth — primary, frictionless */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 bg-background hover:bg-accent/50"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </Button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

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
