import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, BookOpen } from "lucide-react"
import { Note } from "@/types/notes"

interface NoteHeaderProps {
  note: Note
  onGoBack: () => void
  onExportPdf: () => void
  onShare: () => void
  onGenerateAiResume: () => void
}

export function NoteHeader({ note, onGoBack, onExportPdf, onShare, onGenerateAiResume }: NoteHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm z-10 py-2 mb-2">
      <Button variant="ghost" className="flex items-center gap-2" onClick={onGoBack}>
        <ArrowLeft className="h-4 w-4" />
        Retour aux notes
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
        <Button onClick={onExportPdf}>
          <Download className="h-4 w-4 mr-2" />
          Exporter en PDF
        </Button>
      </div>
    </div>
  )
}
