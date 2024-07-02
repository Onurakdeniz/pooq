// app/components/LoginButton.tsx
'use client'

import { useState } from 'react'
import { useLogin } from '@privy-io/react-auth'
import { loginUser } from "@/actions/login"

type LoginButtonProps = {
  variant: 'page' | 'header'
  className?: string
}

export default function LoginButton({ variant, className = '' }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
 
  const { login } = useLogin({
    onComplete: (user) => {
      void (async () => {
        setIsLoading(true)
        try {
          await loginUser(user.id)
        } catch (error) {
          console.error('Login failed:', error)
          // Handle error (e.g., show error message to user)
        } finally {
          setIsLoading(false)
        }
      })()
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
      onClick={() => handleLogin()} // Wrap handleLogin in an arrow function
      disabled={isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {buttonText[variant]}
    </button>
  )
}