"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { useAuthStore } from "@/stores"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore(state => state.login)
  const storeIsLoading = useAuthStore(state => state.isLoading)
  const storeError = useAuthStore(state => state.error)
  const [isLoading, setIsLoading] = useState(false)
  
  // Références pour les champs du formulaire
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Appel à l'API via notre store d'authentification
      await login(email, password)
      
      // Redirection vers le tableau de bord après connexion réussie
      toast.success("Connexion réussie !")
      // Forcer une redirection complète en utilisant window.location plutôt que le router Next.js
      window.location.href = `${window.location.origin}/dashboard`
    } catch (error) {
      // L'erreur est déjà gérée dans le store, mais on peut afficher un toast
      toast.error(storeError || "Échec de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="nom@exemple.fr"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || storeIsLoading}
              required
              ref={emailRef}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading || storeIsLoading}
              required
              ref={passwordRef}
            />
          </div>

          <Button disabled={isLoading || storeIsLoading}>
            {(isLoading || storeIsLoading) && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </div>
      </form>

    </div>
  )
}
