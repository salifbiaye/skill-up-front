"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Download, Edit, Sparkles, Target, Clock, Tag, FileText, Share2, BookOpen } from "lucide-react"
import { useNotesStore } from "@/stores"
import { useAiChatStore } from "@/stores"
import { Note } from "@/types/notes"
import { Skeleton } from "@/components/ui/skeleton"
import { jsPDF } from "jspdf"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

export function NoteDetail() {
  const params = useParams()
  const router = useRouter()
  const getNoteById = useNotesStore(state => state.getNoteById)
  const createChatSession = useAiChatStore(state => state.createChatSession)
  const sendChatMessage = useAiChatStore(state => state.sendMessage)
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      try {
        if (typeof params.id !== "string") {
          throw new Error("ID de note invalide")
        }
        const fetchedNote = await getNoteById(params.id)
        if (!fetchedNote) {
          throw new Error("Note non trouvée")
        }
        setNote(fetchedNote)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [params.id, getNoteById])

  const handleExportPDF = () => {
    if (!note) return

    const doc = new jsPDF()
    
    // Titre
    doc.setFontSize(24)
    doc.text(note.title, 20, 20)
    
    // Date de création
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Créée le ${note.createdAt}`, 20, 30)
    

    // Objectif lié
    if (note.relatedObjective) {
      doc.text(`Objectif: ${note.relatedObjective}`, 20, 50)
    }
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 55, 190, 55)
    
    // Contenu
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    
    // Diviser le contenu en lignes pour éviter les débordements
    const contentLines = doc.splitTextToSize(note.content, 170)
    doc.text(contentLines, 20, 65)
    
    // Télécharger le PDF
    doc.save(`${note.title.replace(/\s+/g, "_")}.pdf`)
  }

  const handleGoBack = () => {
    router.back()
  }

  // Fonction pour créer une session de chat au nom de la note
  const handleGenerateAiResume = async () => {
    if (!note) return
    
    try {
      // Créer une nouvelle session avec le titre de la note
      const sessionTitle = note.title
      
      // Créer une nouvelle session de chat
      const newSession = await createChatSession({
        title: sessionTitle,
      })
      
      // Forcer la mise à jour des sessions de chat avant de rediriger
      await useAiChatStore.getState().fetchChatSessions()
      
      // Rediriger vers la page de chat avec la nouvelle session
      router.push(`/ai-chat?session=${newSession.id}`)
      
      toast.success("Nouvelle session de chat créée")
    } catch (error) {
      console.error("Erreur lors de la création de la session avec note:", error)
      toast.error("Erreur lors de la création de la session de chat")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <Button variant="ghost" className="w-fit" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux notes
        </Button>
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Erreur</h2>
            <p>{error || "Note non trouvée"}</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Retourner à la liste des notes
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Fonction pour partager via WhatsApp
  const shareViaWhatsApp = () => {
    // Générer le PDF
    handleExportPDF();
    
    // Construire l'URL WhatsApp avec un message
    const message = `Découvre ma note "${note.title}" sur SkillUp! 📝`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
    
    // Fermer la boîte de dialogue
    setIsShareModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10 py-2 mb-2">
        <Button variant="ghost" className="flex items-center gap-2" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
          Retour aux notes
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exporter en PDF
          </Button>
          <Button onClick={handleGenerateAiResume}>
            <BookOpen className="h-4 w-4 mr-2" />
            Générer un résumé IA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
        {/* Colonne principale - Note */}
        <Card className="shadow-md md:col-span-3 overflow-hidden border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {note.hasAiSummary && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Résumé IA
                </Badge>
              )}
              {note.relatedTaskId && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Tâche associée
                </Badge>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">{note.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {note.relatedObjective && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Objectif: {note.relatedObjective}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6">
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              {/* Afficher le contenu avec formatage */}
              {note.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < paragraph.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between pt-6 bg-muted/30 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Créée le {format(new Date(note.createdAt), 'PPP', { locale: fr })}</span>
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Modifiée le {format(new Date(note.updatedAt), 'PPP', { locale: fr })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerateAiResume}>
                <BookOpen className="h-4 w-4 mr-1" />
                Resume IA
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Colonne latérale - Métadonnées */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" /> Date de création
                  </dt>
                  <dd>{format(new Date(note.createdAt), 'PPP', { locale: fr })}</dd>
                </div>
                
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <div>
                    <dt className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" /> Dernière modification
                    </dt>
                    <dd>{format(new Date(note.updatedAt), 'PPP', { locale: fr })}</dd>
                  </div>
                )}
                
                {note.relatedObjective && (
                  <div>
                    <dt className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                      <Target className="h-4 w-4" /> Objectif associé
                    </dt>
                    <dd className="font-medium">{note.relatedObjective}</dd>
                  </div>
                )}
                
                {note.relatedTaskId && (
                  <div>
                    <dt className="flex items-center gap-2 font-medium text-muted-foreground mb-1">
                      <FileText className="h-4 w-4" /> Tâche associée
                    </dt>
                    <dd className="font-medium">{note.relatedTaskTitle || "Tâche #" + note.relatedTaskId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Boîte de dialogue de partage */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager la note</DialogTitle>
            <DialogDescription>
              Choisissez comment vous souhaitez partager cette note
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={shareViaWhatsApp}
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">WhatsApp</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => {
                handleExportPDF();
                setIsShareModalOpen(false);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Download className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">Télécharger PDF</span>
            </Button>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Annuler</Button>
            </DialogClose>
            <div className="text-xs text-muted-foreground">
              Le PDF sera généré automatiquement
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
