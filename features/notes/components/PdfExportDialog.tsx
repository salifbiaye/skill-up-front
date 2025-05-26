import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FileDown } from "lucide-react"
import { PdfThemeType } from "./pdf"

interface PdfTheme {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface PdfExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (theme: string, useMarkdown: boolean) => void
  selectedTheme: string
  useMarkdownInPdf: boolean
  onThemeChange: (theme: string) => void
  onUseMarkdownChange: (useMarkdown: boolean) => void
  viewMode: "simple" | "markdown"
}

export function PdfExportDialog({
  isOpen,
  onClose,
  onExport,
  selectedTheme,
  useMarkdownInPdf,
  onThemeChange,
  onUseMarkdownChange,
  viewMode
}: PdfExportDialogProps) {
  const pdfThemes: PdfTheme[] = [
    {
      id: "classic",
      name: "Classique",
      description: "Design sobre et élégant avec une mise en page traditionnelle",
      icon: "📄"
    },
    {
      id: "modern",
      name: "Moderne",
      description: "Style contemporain avec une typographie claire et des espacements optimisés",
      icon: "🔷"
    },
    {
      id: "colorful",
      name: "Coloré",
      description: "Mise en page dynamique avec des accents de couleur pour plus de vivacité",
      icon: "🎨"
    },
    {
      id: "minimal",
      name: "Minimaliste",
      description: "Design épuré avec beaucoup d'espace blanc et une typographie minimaliste",
      icon: "✨"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter la note en PDF</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Choisissez un thème</h3>
            <div className="grid grid-cols-2 gap-3">
              {pdfThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedTheme === theme.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{theme.icon}</span>
                    <span className="font-medium">{theme.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/*<div className="flex items-start space-x-2 mb-6">*/}
          {/*  <Checkbox*/}
          {/*    id="useMarkdown"*/}
          {/*    checked={useMarkdownInPdf}*/}
          {/*    onCheckedChange={(checked) => onUseMarkdownChange(checked as boolean)}*/}
          {/*  />*/}
          {/*  <div className="grid gap-1.5 leading-none">*/}
          {/*    <Label*/}
          {/*      htmlFor="useMarkdown"*/}
          {/*      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
          {/*    >*/}
          {/*      Utiliser le formatage Markdown dans le PDF*/}
          {/*    </Label>*/}
          {/*    <p className="text-xs text-muted-foreground">*/}
          {/*      {viewMode === "markdown"*/}
          {/*        ? "Recommandé car vous utilisez actuellement le mode Markdown"*/}
          {/*        : "Pour préserver le formatage Markdown dans le PDF exporté"}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          
          <Button 
            className="w-full" 
            onClick={() => onExport(selectedTheme, useMarkdownInPdf)}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter avec ce thème
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
