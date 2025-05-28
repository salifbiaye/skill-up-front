"use client"

import { jsPDF } from "jspdf"
import { ThemeStyles } from "./types"

/**
 * Service pour le traitement des tableaux Markdown dans les exports PDF
 */
export class PdfTableService {
  /**
   * Détecte et extrait les tableaux Markdown du contenu
   */
  static extractTables(content: string): {
    processedContent: string,
    tables: Map<string, { headers: string[], rows: string[][] }>
  } {
    const tables = new Map<string, { headers: string[], rows: string[][] }>()
    let tableId = 0
    let processedContent = content

    console.log('Contenu original:', content)

    // Diviser le contenu en lignes pour un traitement plus précis
    const lines = content.split('\n')
    let i = 0

    while (i < lines.length) {
      const line = lines[i].trim()

      // Détecter une ligne de tableau (commence et finit par |)
      if (line.startsWith('|') && line.endsWith('|') && line.includes('**')) {
        console.log('Ligne de tableau détectée:', line)

        // Extraire les en-têtes
        const headers = line
            .split('|')
            .filter(cell => cell.trim() !== '')
            .map(cell => cell.trim().replace(/\*\*/g, ''))

        console.log('En-têtes extraits:', headers)

        // Passer la ligne de séparation
        i++
        if (i < lines.length && lines[i].includes('---') || lines[i].includes('-')) {
          i++
        }

        // Extraire les lignes de données
        const rows: string[][] = []
        while (i < lines.length) {
          const dataLine = lines[i].trim()
          if (dataLine.startsWith('|') && dataLine.endsWith('|')) {
            const row = dataLine
                .split('|')
                .filter(cell => cell.trim() !== '')
                .map(cell => cell.trim().replace(/\*\*/g, ''))

            if (row.length === headers.length) {
              rows.push(row)
              console.log('Ligne de données:', row)
            }
            i++
          } else {
            break
          }
        }

        if (headers.length > 0 && rows.length > 0) {
          const tableMarker = `__TABLE_${tableId}__`
          tables.set(tableMarker, { headers, rows })

          // Remplacer le tableau original par le marqueur
          const startIndex = processedContent.indexOf(line)
          if (startIndex !== -1) {
            // Trouver la fin du tableau
            let endIndex = startIndex
            let tempContent = processedContent.substring(startIndex)
            const tableLines = tempContent.split('\n')

            for (let j = 0; j < tableLines.length; j++) {
              if (j === 0 || tableLines[j].includes('---') || tableLines[j].includes('-') ||
                  (tableLines[j].startsWith('|') && tableLines[j].endsWith('|'))) {
                endIndex = startIndex + tableLines.slice(0, j + 1).join('\n').length
              } else {
                break
              }
            }

            processedContent = processedContent.substring(0, startIndex) +
                `\n${tableMarker}\n` +
                processedContent.substring(endIndex + 1)
          }

          tableId++
        }
      } else {
        i++
      }
    }

    console.log('Tables extraites:', tables)
    console.log('Contenu traité:', processedContent)

    return { processedContent, tables }
  }

  /**
   * Rend un tableau Markdown dans le PDF
   */
  static renderTable(
      doc: jsPDF,
      table: { headers: string[]; rows: string[][] },
      styles: ThemeStyles,
      startY: number
  ): number {
    console.log('Rendu du tableau:', table)

    const config = {
      marginLeft: 10,
      marginRight: 10,
      cellPadding: 2,
      lineHeight: 5,
      fontSize: 8,
      headerBg: [230, 230, 230] as [number, number, number],
      borderColor: [100, 100, 100] as [number, number, number],
      textColor: [0, 0, 0] as [number, number, number]
    }

    const pageWidth = 210 // A4
    const availableWidth = pageWidth - config.marginLeft - config.marginRight

    // Initialisation
    doc.setFont('helvetica')
    doc.setFontSize(config.fontSize)
    doc.setTextColor(...config.textColor)
    doc.setDrawColor(...config.borderColor)
    doc.setLineWidth(0.2)

    let currentY = startY + 5

    // Calcul des largeurs de colonnes - distribution équitable
    const numCols = table.headers.length
    const colWidth = availableWidth / numCols
    const colWidths = new Array(numCols).fill(colWidth)

    console.log('Largeurs de colonnes:', colWidths)

    // Dessin de l'en-tête
    currentY = this.drawTableHeader(doc, table.headers, currentY, colWidths, config)

    // Dessin des lignes
    currentY = this.drawTableRows(doc, table.rows, currentY, colWidths, config)

    return currentY + 10
  }

  private static drawTableHeader(
      doc: jsPDF,
      headers: string[],
      startY: number,
      colWidths: number[],
      config: any
  ): number {
    const headerHeight = 12

    // Fond de l'en-tête
    doc.setFillColor(...config.headerBg)
    doc.rect(config.marginLeft, startY, colWidths.reduce((sum, w) => sum + w, 0), headerHeight, 'F')

    // Texte de l'en-tête
    doc.setFont('helvetica', 'bold')
    let xPos = config.marginLeft

    headers.forEach((header, i) => {
      const cellWidth = colWidths[i]

      // Diviser le texte si trop long
      const maxWidth = cellWidth - config.cellPadding * 2
      const words = header.split(' ')
      const lines: string[] = []
      let currentLine = ''

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      })
      if (currentLine) lines.push(currentLine)

      // Afficher le texte centré verticalement
      const textStartY = startY + 6
      lines.forEach((line, lineIndex) => {
        doc.text(
            line,
            xPos + config.cellPadding,
            textStartY + (lineIndex * config.lineHeight)
        )
      })

      // Bordure de cellule
      doc.rect(xPos, startY, cellWidth, headerHeight)
      xPos += cellWidth
    })

    doc.setFont('helvetica', 'normal')
    return startY + headerHeight
  }

  private static drawTableRows(
      doc: jsPDF,
      rows: string[][],
      startY: number,
      colWidths: number[],
      config: any
  ): number {
    let currentY = startY
    const pageHeight = 280

    rows.forEach((row, rowIndex) => {
      // Calculer la hauteur de ligne nécessaire
      let maxLines = 1
      const cellLines: string[][] = []

      row.forEach((cellText, colIndex) => {
        const cellWidth = colWidths[colIndex]
        const maxWidth = cellWidth - config.cellPadding * 2
        const words = (cellText || '').split(' ')
        const lines: string[] = []
        let currentLine = ''

        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          if (doc.getTextWidth(testLine) <= maxWidth) {
            currentLine = testLine
          } else {
            if (currentLine) lines.push(currentLine)
            currentLine = word
          }
        })
        if (currentLine) lines.push(currentLine)

        cellLines[colIndex] = lines
        maxLines = Math.max(maxLines, lines.length)
      })

      const rowHeight = Math.max(8, maxLines * config.lineHeight + 4)

      // Saut de page si nécessaire
      if (currentY + rowHeight > pageHeight) {
        doc.addPage()
        currentY = 20
      }

      // Dessiner les cellules
      let xPos = config.marginLeft
      row.forEach((cellText, colIndex) => {
        const cellWidth = colWidths[colIndex]
        const lines = cellLines[colIndex] || ['']

        // Dessiner le texte
        lines.forEach((line, lineIndex) => {
          if (line.trim()) {
            doc.text(
                line,
                xPos + config.cellPadding,
                currentY + 6 + (lineIndex * config.lineHeight)
            )
          }
        })

        // Bordure
        doc.rect(xPos, currentY, cellWidth, rowHeight)
        xPos += cellWidth
      })

      currentY += rowHeight
    })

    return currentY
  }
}