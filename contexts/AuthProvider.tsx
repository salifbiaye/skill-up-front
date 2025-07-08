"use client"

import { ReactNode, useEffect } from "react"
import { useAuthStore } from "@/stores/useAuthStore"

interface AuthProviderProps {
  initialAuth: {
    isAuthenticated: boolean
    token: string | null
    email: string | null
  }
  children: ReactNode
}

export function AuthProvider({ initialAuth, children }: AuthProviderProps) {
  const setAuth = useAuthStore((state) => state.set)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (initialAuth.isAuthenticated && !isAuthenticated) {
      setAuth({
        isAuthenticated: true,
        token: initialAuth.token,
        email: initialAuth.email,
      })
    }
  }, [initialAuth, isAuthenticated, setAuth])

  return <>{children}</>
}
