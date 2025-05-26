"use client"

import { jsPDF } from "jspdf"
import { ThemeStyles, CodeBlock } from "./types"

/**
 * Service pour le traitement des blocs de code dans les exports PDF
 */
export class PdfCodeBlockService {
  /**
   * Détecte et extrait les blocs de code du contenu
   */
  static extractCodeBlocks(content: string): { processedContent: string, codeBlocks: Map<string, CodeBlock> } {
    const lines = content.split('\n')
    const processedLines: string[] = []
    const codeBlocks = new Map<string, CodeBlock>()

    let inCodeBlock = false
    let currentCodeBlock: Partial<CodeBlock> = {}
    let blockId = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Début d'un bloc de code
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Démarrage d'un bloc
          inCodeBlock = true
          const language = line.substring(3).trim() || 'text'
          currentCodeBlock = {
            language: language,
            content: '',
            startLine: i
          }

          // Remplacer par un marqueur
          const markerId = `__CODE_BLOCK_${blockId}__`
          processedLines.push(markerId)
        } else {
          // Fin d'un bloc
          inCodeBlock = false
          currentCodeBlock.endLine = i

          const markerId = `__CODE_BLOCK_${blockId}__`
          codeBlocks.set(markerId, currentCodeBlock as CodeBlock)
          blockId++
          currentCodeBlock = {}
        }
      } else if (inCodeBlock) {
        // Ajouter le contenu au bloc de code
        if (currentCodeBlock.content) {
          currentCodeBlock.content += '\n' + lines[i]
        } else {
          currentCodeBlock.content = lines[i]
        }
      } else {
        // Ligne normale
        processedLines.push(lines[i])
      }
    }

    return {
      processedContent: processedLines.join('\n'),
      codeBlocks
    }
  }

  /**
   * Rendu d'un bloc de code avec style
   */
  static renderCodeBlock(
      doc: jsPDF,
      codeBlock: CodeBlock,
      styles: ThemeStyles,
      currentY: number
  ): number {
    const padding = 4
    const lineHeight = 5
    const headerHeight = 12

    // Calculer la hauteur nécessaire
    const codeLines = codeBlock.content.split('\n')
    const blockHeight = headerHeight + (codeLines.length * lineHeight) + (padding * 2)

    // Vérifier si on a besoin d'une nouvelle page
    if (currentY + blockHeight > 297 - 20) {
      doc.addPage()
      currentY = 20
    }

    // Dessiner le fond du bloc
    doc.setFillColor(styles.codeBlockBg[0], styles.codeBlockBg[1], styles.codeBlockBg[2])
    doc.setDrawColor(styles.codeBlockBorder[0], styles.codeBlockBorder[1], styles.codeBlockBorder[2])
    doc.setLineWidth(0.5)
    doc.rect(styles.marginLeft, currentY, styles.contentWidth, blockHeight, "FD")

    // Dessiner l'en-tête avec le langage
    if (codeBlock.language && codeBlock.language !== 'text') {
      doc.setFillColor(styles.languageLabelBg[0], styles.languageLabelBg[1], styles.languageLabelBg[2])
      doc.rect(styles.marginLeft, currentY, 40, headerHeight, "F")

      doc.setFont("courier", "bold")
      doc.setFontSize(8)
      doc.setTextColor(styles.languageLabelText[0], styles.languageLabelText[1], styles.languageLabelText[2])
      doc.text(codeBlock.language.toUpperCase(), styles.marginLeft + 2, currentY + 8)
    }

    // Dessiner le code
    doc.setFont("courier", "normal")
    doc.setFontSize(9)
    doc.setTextColor(styles.codeTextColor[0], styles.codeTextColor[1], styles.codeTextColor[2])

    let codeY = currentY + headerHeight + padding
    for (const codeLine of codeLines) {
      // Gérer les lignes trop longues
      const maxWidth = styles.contentWidth - (padding * 2)
      const wrappedLines = doc.splitTextToSize(codeLine || ' ', maxWidth)

      for (const wrappedLine of wrappedLines) {
        if (codeY + lineHeight > 297 - 20) {
          doc.addPage()
          codeY = 20

          // Redessiner le fond sur la nouvelle page
          doc.setFillColor(styles.codeBlockBg[0], styles.codeBlockBg[1], styles.codeBlockBg[2])
          doc.setDrawColor(styles.codeBlockBorder[0], styles.codeBlockBorder[1], styles.codeBlockBorder[2])
          doc.rect(styles.marginLeft, codeY - padding, styles.contentWidth, 200, "FD")
        }

        doc.text(wrappedLine, styles.marginLeft + padding, codeY)
        codeY += lineHeight
      }
    }

    return codeY + padding + 5
  }
}
