"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotesStore } from "@/stores/useNotesStore"
import { Note } from "@/types/notes"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { NoteHeader } from "./components/NoteHeader"
import { NoteContent } from "./components/NoteContent"
import { NoteSidebar } from "./components/NoteSidebar"
import { PdfExportDialog } from "./components/PdfExportDialog"
import { PdfExportService, PdfThemeType } from "./components/pdf"

interface NoteDetailProps {
  noteId: string
}

export function NoteDetail({ noteId }: NoteDetailProps) {
  const router = useRouter()
  const { getNoteById, updateNote } = useNotesStore()
  
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<"simple" | "markdown">("simple")
  
  // États pour les boîtes de dialogue
  const [isPdfThemeModalOpen, setIsPdfThemeModalOpen] = useState(false)
  const [selectedPdfTheme, setSelectedPdfTheme] = useState<PdfThemeType>("classic")
  const [useMarkdownInPdf, setUseMarkdownInPdf] = useState(true)
  
  // Charger la note
  useEffect(() => {
    const loadNote = async () => {
      try {
        const noteData = await getNoteById(noteId)
        if (noteData) {
          setNote(noteData)
        } else {
          toast.error("Note non trouvée")
          router.push("/notes")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la note:", error)
        toast.error("Erreur lors du chargement de la note")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadNote()
  }, [noteId, getNoteById, router])
  
  // Gestionnaires d'événements
  const handleStartEditing = () => {
    if (note) {
      setEditedContent(note.content)
      setIsEditing(true)
    }
  }
  
  const handleCancelEditing = () => {
    setIsEditing(false)
  }
  
  const handleSaveContent = async () => {
    if (!note) return
    
    setIsSaving(true)
    
    try {
      const updatedNote = {
        ...note,
        content: editedContent,
      }
      
      await updateNote(updatedNote)
      setNote(updatedNote)
      setIsEditing(false)
      toast.success("Note enregistrée avec succès")
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la note:", error)
      toast.error("Erreur lors de l'enregistrement de la note")
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleContentChange = (content: string) => {
    setEditedContent(content)
  }
  
  const handleViewModeChange = (mode: "simple" | "markdown") => {
    setViewMode(mode)
  }
  
  const handleGoBack = () => {
    router.push("/notes")
  }
  
  const handleOpenPdfExport = () => {
    setIsPdfThemeModalOpen(true)
  }
  

  
  const handleExportPDF = async (theme: string, useMarkdown: boolean) => {
    if (!note) return
    
    // Fermer la boîte de dialogue de sélection de thème
    setIsPdfThemeModalOpen(false)
    
    try {
      // Exporter la note en PDF avec le service d'export
      await PdfExportService.exportNoteToPdf(note, {
        theme: theme as PdfThemeType,
        useMarkdownFormat: true
      })
      
      if (useMarkdown && viewMode === "markdown") {
        toast.success("Note exportée en PDF avec formatage Markdown")
      } else {
        toast.success(`Note exportée en PDF avec le thème ${theme}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error)
      toast.error("Une erreur est survenue lors de l'export PDF")
    }
  }
  
  const handleExportMarkdown = () => {
    if (!note) return
    
    try {
      // Créer un blob avec le contenu Markdown de la note
      const blob = new Blob([note.content], { type: 'text/markdown' })
      
      // Créer un URL pour le blob
      const url = URL.createObjectURL(blob)
      
      // Créer un élément a pour le téléchargement
      const a = document.createElement('a')
      a.href = url
      a.download = `${note.title.replace(/\s+/g, '_')}.md`
      
      // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Libérer l'URL
      URL.revokeObjectURL(url)
      
      toast.success("Note exportée en Markdown")
    } catch (error) {
      console.error("Erreur lors de l'export Markdown:", error)
      toast.error("Une erreur est survenue lors de l'export Markdown")
    }
  }

  const handleGenerateAiResume = () => {
    toast.info("Fonctionnalité de résumé IA en cours de développement")
  }
  
  // Afficher un squelette de chargement
  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  
  // Si la note n'est pas trouvée
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl font-semibold mb-2">Note non trouvée</h2>
        <p className="text-muted-foreground mb-4">
          La note que vous recherchez n&apos;existe pas ou a été supprimée.
        </p>
        <button
          onClick={handleGoBack}
          className="text-primary hover:underline"
        >
          Retourner à la liste des notes
        </button>
      </div>
    )
  }
  
  return (
    <div className="mx-auto px-4 py-2">
      <div className="flex flex-col h-full">
        <NoteHeader
          note={note}
          onGoBack={handleGoBack}
          onExportPdf={handleOpenPdfExport}
          onExportMarkdown={handleExportMarkdown}
          onGenerateAiResume={handleGenerateAiResume}
        />
      
        <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Colonne principale - 3/4 de l'espace */}
          <div className="lg:col-span-3 space-y-6">
            {/* Carte principale avec le contenu de la note */}
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
                
                <NoteContent
                  note={note}
                  isEditing={isEditing}
                  editedContent={editedContent}
                  isSaving={isSaving}
                  viewMode={viewMode}
                  onStartEditing={handleStartEditing}
                  onCancelEditing={handleCancelEditing}
                  onSaveContent={handleSaveContent}
                  onContentChange={handleContentChange}
                  onViewModeChange={handleViewModeChange}
                />
              </div>
            </div>
          </div>
          
          {/* Colonne latérale - 1/4 de l'espace */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Détails</h2>
                <NoteSidebar note={note} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Boîtes de dialogue */}
      <PdfExportDialog
        isOpen={isPdfThemeModalOpen}
        onClose={() => setIsPdfThemeModalOpen(false)}
        onExport={handleExportPDF}
        selectedTheme={selectedPdfTheme}
        useMarkdownInPdf={useMarkdownInPdf}
        onThemeChange={(theme) => setSelectedPdfTheme(theme as PdfThemeType)}
        onUseMarkdownChange={setUseMarkdownInPdf}
        viewMode={viewMode}
      />
      </div>
    </div>
  )
}
