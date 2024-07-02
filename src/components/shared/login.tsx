'use client'

import { useState } from 'react'
import { useLogin  } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

type LoginButtonProps = {
  variant: 'page' | 'header'
  className?: string
}

async function upsertUser(userId: string): Promise<void> {
  // ... (unchanged)
}

export default function LoginButton({ variant, className = '' }: LoginButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useLogin({
    onComplete: (user) => {
      setIsLoading(true)
      upsertUser(user.id)
        .then(() => router.push('/feed'))
        .catch((error) => {
          console.error('Failed to upsert user:', error)
        // Handle error (e.g., show error message to user)
      })
      .finally(() => setIsLoading(false))
 
    },
    onError: (error) => {
      console.error('Login error:', error)
      setIsLoading(false)
    },
  })

  const handleLogin = () => {
    setIsLoading(true)
    login()
  }

  const baseStyles = "font-bold text-secondary transition duration-300 disabled:opacity-50"
  const variantStyles = {
    page: "w-full rounded-full px-4 py-3 bg-primary",
    header: "rounded-md px-3 py-1 text-sm bg-primary "
  }

  const buttonText = {
    page: isLoading ? 'Logging in...' : 'Login with Farcaster or Coinbase Wallet',
    header: isLoading ? 'Logging in...' : 'Login'
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {buttonText[variant]}
    </button>
  )
}