'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Loader2 } from 'lucide-react'
import { signIn } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center  bg-cover bg-center">
      <div className="backdrop-blur-sm bg-white/70 p-6 rounded-xl shadow-xl w-full max-w-md">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-primary">Oleum Extra</h1>
            <CardTitle className="text-xl mt-2">Iniciar sesión</CardTitle>
            <CardDescription>Introduce tu correo electrónico para acceder a tu cuenta</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="almazara@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                disabled={loading}
                onClick={async () => {
                  await signIn.magicLink(
                    { email, callbackURL: '/dashboard' },
                    {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                    }
                  )
                }}
                className="w-full"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Acceder con enlace mágico
              </Button>
            </div>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative bg-white px-2 text-muted-foreground text-xs uppercase">O</div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={loading}
              onClick={async () => {
                await signIn.social(
                  {
                    provider: 'google',
                    callbackURL: `${window.location.origin}/dashboard`,
                  },
                  {
                    onRequest: () => setLoading(true),
                    onResponse: () => setLoading(false),
                  }
                )
              }}
            >
              <GoogleIcon className="h-4 w-4" />
              Acceder con Google
            </Button>
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground text-center flex-col">
            <p>Acceso exclusivo para almazaras registradas</p>
            <p>&copy; 2025 Oleum Extra</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 256 262">
      <path fill="#4285F4" d="M255.9 133.5c0-10.7-.9-18.6-2.8-26.7H130.6v48.4h71.9c-1.5 12-9.3 30.2-26.7 42.4l-.2 1.6 38.8 30 .3.3c24.7-22.8 38.9-56.3 38.9-96z" />
      <path fill="#34A853" d="M130.6 261.1c35.2 0 64.8-11.6 86.5-31.6l-41.2-31.9c-11 7.7-25.8 13.1-45.3 13.1-34.5 0-63.8-22.8-74.3-54.3l-1.5.1-40.3 31.2-.5 1.5C35.4 231.8 79.5 261.1 130.6 261.1z" />
      <path fill="#FBBC05" d="M56.3 156.4c-2.8-8.1-4.4-16.8-4.4-25.8s1.6-17.7 4.2-25.8l-.1-1.7L15.3 71.3l-1.3.6C5.1 89.6 0 109.5 0 130.6s5.1 40.9 13.9 58.6z" />
      <path fill="#EB4335" d="M130.6 50.5c24.5 0 41 10.6 50.5 19.4L218 34C195.2 12.9 165.8 0 130.6 0 79.5 0 35.4 29.3 13.9 71.9l42.2 32.8c10.6-31.5 39.9-54.2 74.5-54.2z" />
    </svg>
  )
}
