"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Calendar, BookOpen, Briefcase, Edit, Loader2, Upload } from "lucide-react"
import { useProfileStore } from "@/stores"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UpdateProfileInput } from "@/types/profile"
import {toast} from "sonner";

export function ProfileInfo() {
  const profile = useProfileStore(state => state.profile)
  const isLoading = useProfileStore(state => state.isLoading)
  const error = useProfileStore(state => state.error)
  const updateProfile = useProfileStore(state => state.updateProfile)
  const uploadProfileImage = useProfileStore(state => state.uploadProfileImage)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: "",
    bio: "",
    location: "",
    occupation: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Initialiser le formulaire avec les données du profil
  const initializeForm = () => {
    if (profile) {
      setFormData({
        name: profile.fullName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        occupation: profile.occupation || ""
      })
    }
  }

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Gérer le changement des champs du formulaire
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Gérer le changement des champs du formulaire
  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Gérer la sélection d'une image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Créer un aperçu de l'image
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    setIsSubmitting(true)
    try {
      // Télécharger l'image si une nouvelle a été sélectionnée
      let newAvatarUrl = profile.avatarUrl
      if (imageFile) {
        newAvatarUrl = await uploadProfileImage(imageFile)
      }
      
      // Mettre à jour le profil
      await updateProfile({
        ...formData,
        avatarUrl: newAvatarUrl
      })
      
      setIsEditDialogOpen(false)
    } catch (error) {
     toast.error("Erreur lors de la mise à jour du profil. Veuillez réessayer plus tard.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formater la date d'inscription
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    } catch (error) {
      console.error('Erreur de formatage de date:', error)
      return 'Date invalide'
    }
  }

  // Obtenir les initiales pour l'avatar
  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (error || !profile) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Erreur lors du chargement du profil</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle>Informations personnelles</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              initializeForm()
              setIsEditDialogOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Vos informations de profil</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center  text-center pb-6">
        <Avatar className=" h-24 w-24 mb-4">
          <AvatarFallback className="text-xl">{getInitials(profile.fullName || '')}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold">{profile.fullName}</h3>
        <p className="text-sm text-muted-foreground mb-4">{profile.bio || "Aucune bio renseignée"}</p>
        <Badge className="mb-6">{profile.occupation || profile.role}</Badge>
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{profile.email}</span>
          </div>
          {profile.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Membre depuis {formatDate(profile.createdAt)}</span>
          </div>
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Dialogue de modification du profil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier votre profil</DialogTitle>
            <DialogDescription>
              Mettez à jour vos informations personnelles ici. Cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarFallback>{getInitials(profile.fullName || '')}</AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Upload className="h-4 w-4" />
                    <span>Changer l'image</span>
                  </div>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                </Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows={3} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localisation</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location || ""} 
                  onChange={handleLocationChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="occupation">Profession</Label>
                <Input 
                  id="occupation" 
                  name="occupation" 
                  value={formData.occupation || ""} 
                  onChange={handleOccupationChange} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
