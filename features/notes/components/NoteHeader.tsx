import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, BookOpen } from "lucide-react"
import { Note } from "@/types/notes"

interface NoteHeaderProps {
  note: Note
  onGoBack: () => void
  onExportPdf: () => void
  onExportMarkdown: () => void
  onGenerateAiResume: () => void
}

export function NoteHeader({ note, onGoBack, onExportPdf, onExportMarkdown, onGenerateAiResume }: NoteHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm z-10 py-2 mb-2">
      <Button variant="ghost" className="flex items-center gap-2" onClick={onGoBack}>
        <ArrowLeft className="h-4 w-4" />
        Retour aux notes
      </Button>
      <div className="flex items-center gap-2">
        <Button onClick={onExportPdf}>
          <Download className="h-4 w-4 mr-2" />
          Exporter en PDF
        </Button>
        <Button onClick={onExportMarkdown} variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Exporter en MD
        </Button>
      </div>
    </div>
  )
}
