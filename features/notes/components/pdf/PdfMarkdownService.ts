"use client"

import { jsPDF } from "jspdf"
import { ThemeStyles, FormattedText } from "./types"

/**
 * Service pour le traitement du Markdown dans les exports PDF
 */
export class PdfMarkdownService {
  /**
   * Traite le formatage Markdown (gras et italique)
   */
  static processMarkdownFormatting(text: string): Array<FormattedText> {
    const result: Array<FormattedText> = []
    let currentText = text
    let position = 0

    while (position < currentText.length) {
      // Chercher le prochain formatage
      const boldMatch = currentText.substring(position).match(/\*\*(.*?)\*\*/)
      const italicMatch = currentText.substring(position).match(/(?<!\*)\*(.*?)\*(?!\*)/)

      let nextMatch = null
      let matchType = null
      let matchStart = currentText.length

      if (boldMatch && position + boldMatch.index! < matchStart) {
        nextMatch = boldMatch
        matchType = 'bold'
        matchStart = position + boldMatch.index!
      }

      if (italicMatch && position + italicMatch.index! < matchStart) {
        nextMatch = italicMatch
        matchType = 'italic'
        matchStart = position + italicMatch.index!
      }

      if (nextMatch) {
        // Ajouter le texte avant le formatage
        if (matchStart > position) {
          const beforeText = currentText.substring(position, matchStart)
          if (beforeText) {
            result.push({text: beforeText, bold: false, italic: false})
          }
        }

        // Ajouter le texte formaté
        const formattedText = nextMatch[1]
        result.push({
          text: formattedText,
          bold: matchType === 'bold',
          italic: matchType === 'italic'
        })

        // Avancer la position
        position = matchStart + nextMatch[0].length
      } else {
        // Pas de formatage trouvé, ajouter le reste du texte
        const remainingText = currentText.substring(position)
        if (remainingText) {
          result.push({text: remainingText, bold: false, italic: false})
        }
        break
      }
    }

    return result.length > 0 ? result : [{text: text, bold: false, italic: false}]
  }

  /**
   * Rend le texte formaté
   */
  static async renderFormattedText(
      doc: jsPDF,
      formattedText: Array<FormattedText>,
      x: number,
      y: number,
      maxWidth: number,
      styles: ThemeStyles
  ): Promise<void> {
    let currentX = x
    const lineHeight = 6

    for (const segment of formattedText) {
      if (!segment.text) continue

      // Appliquer le style
      let fontStyle = "normal"
      if (segment.bold && segment.italic) {
        fontStyle = "bolditalic"
      } else if (segment.bold) {
        fontStyle = "bold"
      } else if (segment.italic) {
        fontStyle = "italic"
      }

      doc.setFont(styles.textFont, fontStyle)

      // Gérer le retour à la ligne si nécessaire
      const textWidth = doc.getTextWidth(segment.text)
      if (currentX + textWidth > x + maxWidth) {
        currentX = x
        y += lineHeight
      }

      doc.text(segment.text, currentX, y)
      currentX += textWidth
    }
  }

  /**
   * Rendu du code en ligne (avec backticks simples)
   */
  static async renderInlineCode(
      doc: jsPDF,
      text: string,
      styles: ThemeStyles,
      currentY: number
  ): Promise<void> {
    const segments = text.split('`')
    let currentX = styles.marginLeft

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const isCode = i % 2 === 1 // Les segments d'index impair sont du code

      if (isCode) {
        // Fond gris pour le code en ligne
        const textWidth = doc.getTextWidth(segment)
        doc.setFillColor(240, 240, 240)
        doc.rect(currentX - 1, currentY - 4, textWidth + 2, 6, "F")

        // Texte du code
        doc.setFont("courier", "normal")
        doc.setFontSize(styles.textSize - 1)
        doc.setTextColor(200, 0, 0)
        doc.text(segment, currentX, currentY)
        currentX += textWidth + 2
      } else {
        // Texte normal
        doc.setFont(styles.textFont, "normal")
        doc.setFontSize(styles.textSize)
        doc.setTextColor(styles.textColor[0], styles.textColor[1], styles.textColor[2])
        doc.text(segment, currentX, currentY)
        currentX += doc.getTextWidth(segment)
      }
    }
  }

  /**
   * Ajoute du texte avec gestion automatique de la pagination
   */
  static async addTextWithPagination(
      doc: jsPDF,
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      fontFamily: string = "helvetica"
  ): Promise<void> {
    const lines = doc.splitTextToSize(text, maxWidth)
    const lineHeight = 6
    const pageHeight = 297
    const marginBottom = 20
    let currentY = startY

    for (const line of lines) {
      if (currentY + lineHeight > pageHeight - marginBottom) {
        doc.addPage()
        currentY = 20
      }

      doc.text(line, x, currentY)
      currentY += lineHeight
    }
  }
}
