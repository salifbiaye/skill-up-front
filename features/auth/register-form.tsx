"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import { useAuthStore } from "@/stores"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const register = useAuthStore(state => state.register)
  const storeIsLoading = useAuthStore(state => state.isLoading)
  const storeError = useAuthStore(state => state.error)
  const [isLoading, setIsLoading] = useState(false)
  
  // Références pour les champs du formulaire
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    
    const firstName = firstNameRef.current?.value
    const lastName = lastNameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    const confirmPassword = confirmPasswordRef.current?.value
    
    // Validation des champs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Appel à l'API via notre store d'authentification
      await register(email, password, `${firstName} ${lastName}`)
      
      // Redirection vers le tableau de bord après inscription réussie
      toast.success("Compte créé avec succès !")
      
      // Forcer une redirection complète en utilisant window.location plutôt que le router Next.js
      window.location.href = `${window.location.origin}/dashboard`
    } catch (error) {
      // L'erreur est déjà gérée dans le store, mais on peut afficher un toast
      toast.error(storeError || "Échec de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Prénom</Label>
              <Input
                id="first-name"
                placeholder="Jean"
                disabled={isLoading || storeIsLoading}
                required
                ref={firstNameRef}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Nom</Label>
              <Input 
                id="last-name" 
                placeholder="Dupont" 
                disabled={isLoading || storeIsLoading} 
                required 
                ref={lastNameRef}
              />
            </div>
          </div>
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
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading || storeIsLoading}
              required
              ref={passwordRef}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading || storeIsLoading}
              required
              ref={confirmPasswordRef}
            />
          </div>
          <Button disabled={isLoading || storeIsLoading}>
            {(isLoading || storeIsLoading) && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Créer un compte
          </Button>
        </div>
      </form>

    </div>
  )
}
