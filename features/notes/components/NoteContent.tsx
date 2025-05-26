"use client"

import { useState, useRef } from "react"
import { Note } from "@/types/notes"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check, X, Edit, FileCode, AlignLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface NoteContentProps {
  note: Note
  isEditing: boolean
  editedContent: string
  isSaving: boolean
  viewMode: "simple" | "markdown"
  onStartEditing: () => void
  onCancelEditing: () => void
  onSaveContent: () => void
  onContentChange: (content: string) => void
  onViewModeChange: (mode: "simple" | "markdown") => void
}

export function NoteContent({
  note,
  isEditing,
  editedContent,
  isSaving,
  viewMode,
  onStartEditing,
  onCancelEditing,
  onSaveContent,
  onContentChange,
  onViewModeChange
}: NoteContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="pt-6 relative">
      {isEditing ? (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[300px] resize-y p-4 font-normal text-base leading-relaxed focus-visible:ring-1"
            placeholder="Contenu de la note..."
          />
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancelEditing}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button 
              size="sm" 
              onClick={onSaveContent}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-1">⏳</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Sélecteur de mode d'affichage */}
          <div className="flex justify-end mb-4">
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && onViewModeChange(value as "simple" | "markdown")}
            >
              <ToggleGroupItem value="simple" aria-label="Mode simple" title="Mode simple">
                <AlignLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Simple</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="markdown" aria-label="Mode markdown" title="Mode markdown">
                <FileCode className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Markdown</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none relative group cursor-pointer"
            onClick={onStartEditing}
          >
            {viewMode === "simple" ? (
              /* Mode simple: Afficher le contenu avec formatage basique */
              <>
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
              </>
            ) : (
              /* Mode markdown: Utiliser ReactMarkdown pour le rendu */
              <div className="markdown-content">
                <ReactMarkdown>
                  {note.content}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Bouton d'édition qui apparaît au survol */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
