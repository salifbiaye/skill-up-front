"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, } from "lucide-react"
import { useProfileStore } from "@/stores"
import { ProfileService } from "@/services/profile-service"

interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileSecurity() {
  const profile = useProfileStore(state => state.profile)
  const isLoading = useProfileStore(state => state.isLoading)
  const changePassword = useProfileStore(state => state.changePassword)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    // Vérifier que les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    
    // Vérifier la complexité du mot de passe
    if (formData.newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }
    
    setIsSubmitting(true)
    try {
      // Appeler le store Zustand pour changer le mot de passe
      await changePassword(formData.currentPassword, formData.newPassword)
      
      setSuccess("Votre mot de passe a été modifié avec succès")
      // Réinitialiser le formulaire
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      // Fermer la boîte de dialogue après un délai
      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess(null)
      }, 2000)
    } catch (err) {
      setError("Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !profile) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Mot de passe</p>
                <p className="text-sm text-muted-foreground">Dernière modification il y a plus de 30 jours</p>
              </div>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>Modifier</Button>
          </div>

        </div>
      </CardContent>

      {/* Dialogue de changement de mot de passe */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Changer votre mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et votre nouveau mot de passe ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md mb-4">
                {success}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type="password" 
                  value={formData.currentPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword" 
                  type="password" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  "Modifier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
