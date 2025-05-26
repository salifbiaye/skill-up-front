"use client"

import { jsPDF } from "jspdf"
import { Note } from "@/types/notes"
import { PdfThemeType, PdfExportOptions, ThemeStyles } from "./types"
import { PdfThemeService } from "./PdfThemeService"
import { PdfMarkdownService } from "./PdfMarkdownService"
import { PdfCodeBlockService } from "./PdfCodeBlockService"
import { PdfUtilsService } from "./PdfUtilsService"

/**
 * Service principal pour l'export de notes en PDF
 */
export class PdfExportService {
  /**
   * Exporte une note en PDF
   */
  static async exportNoteToPdf(note: Note, options: PdfExportOptions): Promise<void> {
    if (options.useMarkdownFormat) {
      await PdfExportService.exportWithMarkdownTheme(note, options.theme)
    } else {
      await PdfExportService.exportWithTheme(note, options.theme)
    }
  }

  /**
   * Export Markdown avec thème appliqué
   */
  private static async exportWithMarkdownTheme(note: Note, theme: PdfThemeType): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const themeStyles = PdfThemeService.getThemeStyles(theme)
    let currentY = 25

    // Appliquer l'en-tête selon le thème
    currentY = await PdfThemeService.applyThemeHeader(doc, note, theme, themeStyles)

    // Traitement du contenu avec Markdown thématisé
    const processedContent = PdfUtilsService.processEmojis(note.content)
    await PdfExportService.renderThemedMarkdown(doc, processedContent, themeStyles, currentY)

    // Sauvegarde
    const filename = PdfUtilsService.generateSafeFilename(note.title, theme, true)
    doc.save(filename)
  }

  /**
   * Rendu Markdown avec thème appliqué et support des blocs de code
   */
  private static async renderThemedMarkdown(
      doc: jsPDF,
      content: string,
      styles: ThemeStyles,
      startY: number
  ): Promise<void> {
    // Extraire les blocs de code
    const { processedContent, codeBlocks } = PdfCodeBlockService.extractCodeBlocks(content)

    const lines = processedContent.split('\n')
    let currentY = startY
    const lineHeight = 6
    const pageHeight = 297
    const marginBottom = 20

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Vérifier pagination pour le texte normal
      if (currentY + lineHeight > pageHeight - marginBottom && !trimmedLine.startsWith('__CODE_BLOCK_')) {
        doc.addPage()
        currentY = 20
      }

      // Gérer les blocs de code
      if (trimmedLine.startsWith('__CODE_BLOCK_') && trimmedLine.endsWith('__')) {
        const codeBlock = codeBlocks.get(trimmedLine)
        if (codeBlock) {
          currentY = PdfCodeBlockService.renderCodeBlock(doc, codeBlock, styles, currentY)
          continue
        }
      }

      // Code en ligne avec backticks
      if (trimmedLine.includes('`') && !trimmedLine.startsWith('```')) {
        await PdfMarkdownService.renderInlineCode(doc, trimmedLine, styles, currentY)
        currentY += lineHeight + 2
        continue
      }

      // Ligne de séparation ---
      if (trimmedLine === '---') {
        doc.setDrawColor(styles.separatorColor[0], styles.separatorColor[1], styles.separatorColor[2])
        doc.setLineWidth(0.5)
        doc.line(styles.marginLeft, currentY + 2, styles.marginLeft + styles.contentWidth, currentY + 2)
        currentY += 8
        continue
      }

      // Titre H1 #
      if (trimmedLine.startsWith('# ')) {
        doc.setFont(styles.textFont, "bold")
        doc.setFontSize(styles.h1Size)
        doc.setTextColor(styles.h1Color[0], styles.h1Color[1], styles.h1Color[2])
        const titleText = trimmedLine.substring(2)
        const titleLines = doc.splitTextToSize(titleText, styles.contentWidth)
        doc.text(titleLines, styles.marginLeft, currentY)
        currentY += titleLines.length * 8 + 5
        continue
      }

      // Titre H2 ##
      if (trimmedLine.startsWith('## ')) {
        doc.setFont(styles.textFont, "bold")
        doc.setFontSize(styles.h2Size)
        doc.setTextColor(styles.h2Color[0], styles.h2Color[1], styles.h2Color[2])
        const titleText = trimmedLine.substring(3)
        const titleLines = doc.splitTextToSize(titleText, styles.contentWidth)
        doc.text(titleLines, styles.marginLeft, currentY)
        currentY += titleLines.length * 7 + 4
        continue
      }

      // Titre H3 ###
      if (trimmedLine.startsWith('### ')) {
        doc.setFont(styles.textFont, "bold")
        doc.setFontSize(styles.h3Size)
        doc.setTextColor(styles.h3Color[0], styles.h3Color[1], styles.h3Color[2])
        const titleText = trimmedLine.substring(4)
        const titleLines = doc.splitTextToSize(titleText, styles.contentWidth)
        doc.text(titleLines, styles.marginLeft, currentY)
        currentY += titleLines.length * 6 + 3
        continue
      }

      // Liste à puces *
      if (trimmedLine.startsWith('* ')) {
        doc.setFont(styles.textFont, "normal")
        doc.setFontSize(styles.textSize)
        doc.setTextColor(styles.textColor[0], styles.textColor[1], styles.textColor[2])
        const bulletText = trimmedLine.substring(2)

        // Puce
        doc.text('•', styles.marginLeft, currentY)

        // Texte avec formatage et indentation
        const processedText = PdfMarkdownService.processMarkdownFormatting(bulletText)
        await PdfMarkdownService.renderFormattedText(doc, processedText, styles.marginLeft + 6, currentY, styles.contentWidth - 8, styles)
        currentY += 8
        continue
      }

      // Ligne vide
      if (trimmedLine === '') {
        currentY += 4
        continue
      }

      // Texte normal avec formatage
      doc.setFont(styles.textFont, "normal")
      doc.setFontSize(styles.textSize)
      doc.setTextColor(styles.textColor[0], styles.textColor[1], styles.textColor[2])

      const processedText = PdfMarkdownService.processMarkdownFormatting(trimmedLine)
      await PdfMarkdownService.renderFormattedText(doc, processedText, styles.marginLeft, currentY, styles.contentWidth, styles)
      currentY += 8
    }
  }

  /**
   * Export avec thèmes (garde l'ancien système)
   */
  private static async exportWithTheme(note: Note, theme: PdfThemeType): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    switch (theme) {
      case "classic":
        await PdfExportService.applyClassicTheme(doc, note)
        break
      case "modern":
        await PdfExportService.applyModernTheme(doc, note)
        break
      case "colorful":
        await PdfExportService.applyColorfulTheme(doc, note)
        break
      case "minimal":
        await PdfExportService.applyMinimalTheme(doc, note)
        break
    }

    const filename = PdfUtilsService.generateSafeFilename(note.title, theme)
    doc.save(filename)
  }

  /**
   * Applique le thème Classique au PDF
   */
  private static async applyClassicTheme(doc: jsPDF, note: Note): Promise<void> {
    const marginLeft = 20
    const marginRight = 20
    const contentWidth = 170
    let currentY = 25

    // En-tête avec ornements classiques
    doc.setDrawColor(139, 69, 19)
    doc.setLineWidth(1)
    doc.line(marginLeft, 15, 190, 15)
    doc.line(marginLeft, 17, 190, 17)

    // Titre principal
    doc.setFont("times", "bold")
    doc.setFontSize(22)
    doc.setTextColor(139, 69, 19)
    const titleLines = doc.splitTextToSize(note.title, contentWidth)
    doc.text(titleLines, marginLeft, currentY)
    currentY += titleLines.length * 8 + 5

    // Ornement sous le titre
    doc.setDrawColor(184, 134, 11)
    doc.setLineWidth(0.5)
    doc.line(marginLeft, currentY, marginLeft + 60, currentY)
    currentY += 8

    // Métadonnées dans un cadre
    doc.setFillColor(248, 248, 240)
    doc.setDrawColor(139, 69, 19)
    doc.rect(marginLeft, currentY, contentWidth, 15, "FD")

    doc.setFont("times", "italic")
    doc.setFontSize(10)
    doc.setTextColor(101, 67, 33)

    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date().toLocaleDateString('fr-FR')

    doc.text(`Créée le ${createdDate}`, marginLeft + 5, currentY + 6)

    if (note.updatedAt && note.updatedAt !== note.createdAt) {
      const updatedDate = new Date(note.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      doc.text(`Modifiée le ${updatedDate}`, marginLeft + 5, currentY + 11)
    }

    currentY += 25

    // Contenu principal
    doc.setFont("times", "normal")
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)

    const processedContent = PdfUtilsService.processEmojis(note.content)
    await PdfMarkdownService.addTextWithPagination(doc, processedContent, marginLeft, currentY, contentWidth, "times")
  }

  /**
   * Applique le thème Moderne au PDF
   */
  private static async applyModernTheme(doc: jsPDF, note: Note): Promise<void> {
    const marginLeft = 25
    const contentWidth = 160
    let currentY = 30

    // Gradient header simulation
    doc.setFillColor(240, 240, 240)
    doc.rect(0, 0, 210, 60, "F")

    // Accent moderne
    doc.setFillColor(0, 123, 255)
    doc.rect(0, 0, 210, 4, "F")

    // Titre moderne
    doc.setFont("helvetica", "bold")
    doc.setFontSize(24)
    doc.setTextColor(33, 37, 41)
    const titleLines = doc.splitTextToSize(note.title, contentWidth)
    doc.text(titleLines, marginLeft, currentY)
    currentY += titleLines.length * 9 + 8

    // Sous-titre stylé
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(108, 117, 125)

    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : new Date().toLocaleDateString('fr-FR')

    doc.text(` ${createdDate}`, marginLeft, currentY)
    currentY += 6

    if (note.updatedAt && note.updatedAt !== note.createdAt) {
      const updatedDate = new Date(note.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(` Modifiée le ${updatedDate}`, marginLeft, currentY)
      currentY += 6
    }

    currentY += 10

    // Ligne de séparation moderne
    doc.setDrawColor(0, 123, 255)
    doc.setLineWidth(2)
    doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY)
    currentY += 15

    // Contenu
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(33, 37, 41)

    const processedContent = PdfUtilsService.processEmojis(note.content)
    await PdfMarkdownService.addTextWithPagination(doc, processedContent, marginLeft, currentY, contentWidth, "helvetica")
  }

  /**
   * Applique le thème Coloré au PDF
   */
  private static async applyColorfulTheme(doc: jsPDF, note: Note): Promise<void> {
    const marginLeft = 25
    const contentWidth = 160
    let currentY = 40

    // Bandes colorées en header
    const colors = [
      [255, 107, 107], // Rouge
      [255, 159, 67],  // Orange
      [255, 206, 84],  // Jaune
      [75, 192, 192],  // Vert
      [54, 162, 235],  // Bleu
      [153, 102, 255]  // Violet
    ]

    for (let i = 0; i < colors.length; i++) {
      doc.setFillColor(colors[i][0], colors[i][1], colors[i][2])
      doc.rect(i * 35, 0, 35, 8, "F")
    }

    // Titre coloré
    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(54, 162, 235)
    const titleLines = doc.splitTextToSize(note.title, contentWidth)
    doc.text(titleLines, marginLeft, currentY)
    currentY += titleLines.length * 9 + 10

    // Badge coloré pour la date
    doc.setFillColor(75, 192, 192)
    doc.roundedRect(marginLeft, currentY, 120, 12, 6, 6, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)

    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
    doc.text(` ${createdDate}`, marginLeft + 5, currentY + 8)
    currentY += 25

    if (note.updatedAt && note.updatedAt !== note.createdAt) {
      doc.setFillColor(255, 159, 67)
      doc.roundedRect(marginLeft, currentY, 130, 12, 6, 6, "F")

      doc.setTextColor(255, 255, 255)
      const updatedDate = new Date(note.updatedAt).toLocaleDateString('fr-FR')
      doc.text(` Modifiée le ${updatedDate}`, marginLeft + 5, currentY + 8)
      currentY += 20
    }

    // Séparateur coloré
    doc.setDrawColor(153, 102, 255)
    doc.setLineWidth(2)
    doc.line(marginLeft, currentY, marginLeft + contentWidth, currentY)
    currentY += 15

    // Contenu avec fond très léger
    doc.setFillColor(248, 249, 250)
    doc.rect(marginLeft - 5, currentY - 5, contentWidth + 10, 200, "F")

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(33, 37, 41)

    const processedContent = PdfUtilsService.processEmojis(note.content)
    await PdfMarkdownService.addTextWithPagination(doc, processedContent, marginLeft, currentY, contentWidth, "helvetica")
  }

  /**
   * Applique le thème Minimaliste au PDF
   */
  private static async applyMinimalTheme(doc: jsPDF, note: Note): Promise<void> {
    const marginLeft = 40
    const contentWidth = 130
    let currentY = 50

    // Titre minimaliste
    doc.setFont("helvetica", "light")
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    const titleLines = doc.splitTextToSize(note.title, contentWidth)
    doc.text(titleLines, marginLeft, currentY)
    currentY += titleLines.length * 7 + 15

    // Ligne minimaliste
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(marginLeft, currentY, marginLeft + 40, currentY)
    currentY += 10

    // Date minimaliste
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)

    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) : new Date().toLocaleDateString('fr-FR')

    doc.text(createdDate, marginLeft, currentY)
    currentY += 20

    // Contenu minimaliste
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)

    const processedContent = PdfUtilsService.processEmojis(note.content)
    await PdfMarkdownService.addTextWithPagination(doc, processedContent, marginLeft, currentY, contentWidth, "helvetica")
  }
}
