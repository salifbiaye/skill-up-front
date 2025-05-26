"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Link2, Copy, Check, Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  noteTitle: string
  noteId: string
}

export function ShareDialog({ isOpen, onClose, noteTitle, noteId }: ShareDialogProps) {
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const shareUrl = `${window.location.origin}/notes/shared/${noteId}`
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Lien copié dans le presse-papier")
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    
    // Simuler l'envoi d'un email (à remplacer par une vraie implémentation)
    setTimeout(() => {
      setIsSending(false)
      setEmail("")
      toast.success(`Invitation envoyée à ${email}`)
    }, 1500)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Partager &quot;{noteTitle}&quot;</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="link">
              <Link2 className="h-4 w-4 mr-2" />
              Lien
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="link">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-link">Lien de partage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Toute personne disposant de ce lien pourra voir cette note.
              </p>
              
              <Button className="w-full" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Lien copié
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le lien
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email">
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Un email avec un lien vers cette note sera envoyé à cette adresse.
              </p>
              
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Envoyer l&apos;invitation
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
