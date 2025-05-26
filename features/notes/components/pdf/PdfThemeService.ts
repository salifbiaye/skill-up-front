"use client"

import { jsPDF } from "jspdf"
import { Note } from "@/types/notes"
import { PdfThemeType, ThemeStyles } from "./types"

/**
 * Service pour gérer les thèmes des exports PDF
 */
export class PdfThemeService {
  /**
   * Récupère les styles pour chaque thème
   */
  static getThemeStyles(theme: PdfThemeType): ThemeStyles {
    switch (theme) {
      case "classic":
        return {
          titleFont: "times",
          titleSize: 22,
          titleColor: [139, 69, 19],
          subtitleFont: "times",
          subtitleSize: 10,
          subtitleColor: [101, 67, 33],
          textFont: "times",
          textSize: 12,
          textColor: [0, 0, 0],
          h1Size: 18,
          h1Color: [139, 69, 19],
          h2Size: 15,
          h2Color: [101, 67, 33],
          h3Size: 13,
          h3Color: [80, 80, 80],
          separatorColor: [184, 134, 11],
          codeBlockBg: [250, 248, 240],
          codeBlockBorder: [139, 69, 19],
          codeTextColor: [51, 51, 51],
          languageLabelBg: [139, 69, 19],
          languageLabelText: [255, 255, 255],
          marginLeft: 20,
          contentWidth: 170
        }
      case "modern":
        return {
          titleFont: "helvetica",
          titleSize: 24,
          titleColor: [33, 37, 41],
          subtitleFont: "helvetica",
          subtitleSize: 11,
          subtitleColor: [108, 117, 125],
          textFont: "helvetica",
          textSize: 11,
          textColor: [33, 37, 41],
          h1Size: 18,
          h1Color: [0, 123, 255],
          h2Size: 15,
          h2Color: [33, 37, 41],
          h3Size: 13,
          h3Color: [108, 117, 125],
          separatorColor: [0, 123, 255],
          codeBlockBg: [248, 249, 250],
          codeBlockBorder: [206, 212, 218],
          codeTextColor: [33, 37, 41],
          languageLabelBg: [0, 123, 255],
          languageLabelText: [255, 255, 255],
          marginLeft: 25,
          contentWidth: 160
        }
      case "colorful":
        return {
          titleFont: "helvetica",
          titleSize: 22,
          titleColor: [54, 162, 235],
          subtitleFont: "helvetica",
          subtitleSize: 9,
          subtitleColor: [255, 255, 255],
          textFont: "helvetica",
          textSize: 11,
          textColor: [33, 37, 41],
          h1Size: 17,
          h1Color: [255, 107, 107],
          h2Size: 14,
          h2Color: [75, 192, 192],
          h3Size: 12,
          h3Color: [153, 102, 255],
          separatorColor: [153, 102, 255],
          codeBlockBg: [45, 52, 54],
          codeBlockBorder: [255, 107, 107],
          codeTextColor: [255, 255, 255],
          languageLabelBg: [255, 107, 107],
          languageLabelText: [255, 255, 255],
          marginLeft: 25,
          contentWidth: 160
        }
      case "minimal":
        return {
          titleFont: "helvetica",
          titleSize: 18,
          titleColor: [0, 0, 0],
          subtitleFont: "helvetica",
          subtitleSize: 9,
          subtitleColor: [150, 150, 150],
          textFont: "helvetica",
          textSize: 10,
          textColor: [60, 60, 60],
          h1Size: 14,
          h1Color: [0, 0, 0],
          h2Size: 12,
          h2Color: [60, 60, 60],
          h3Size: 11,
          h3Color: [100, 100, 100],
          separatorColor: [200, 200, 200],
          codeBlockBg: [245, 245, 245],
          codeBlockBorder: [200, 200, 200],
          codeTextColor: [60, 60, 60],
          languageLabelBg: [100, 100, 100],
          languageLabelText: [255, 255, 255],
          marginLeft: 40,
          contentWidth: 130
        }
      default:
        return this.getThemeStyles("modern")
    }
  }

  /**
   * Applique l'en-tête selon le thème
   */
  static async applyThemeHeader(
      doc: jsPDF,
      note: Note,
      theme: PdfThemeType,
      styles: ThemeStyles
  ): Promise<number> {
    let currentY = 25

    switch (theme) {
      case "classic":
        // En-tête avec ornements classiques
        doc.setDrawColor(139, 69, 19)
        doc.setLineWidth(1)
        doc.line(styles.marginLeft, 15, 190, 15)
        doc.line(styles.marginLeft, 17, 190, 17)
        break

      case "modern":
        // Gradient header simulation
        doc.setFillColor(240, 240, 240)
        doc.rect(0, 0, 210, 60, "F")
        // Accent moderne
        doc.setFillColor(0, 123, 255)
        doc.rect(0, 0, 210, 4, "F")
        currentY = 30
        break

      case "colorful":
        // Bandes colorées en header
        const colors = [
          [255, 107, 107], [255, 159, 67], [255, 206, 84],
          [75, 192, 192], [54, 162, 235], [153, 102, 255]
        ]
        for (let i = 0; i < colors.length; i++) {
          doc.setFillColor(colors[i][0], colors[i][1], colors[i][2])
          doc.rect(i * 35, 0, 35, 8, "F")
        }
        currentY = 40
        break

      case "minimal":
        currentY = 50
        break
    }

    // Titre principal
    doc.setFont(styles.titleFont, "bold")
    doc.setFontSize(styles.titleSize)
    doc.setTextColor(styles.titleColor[0], styles.titleColor[1], styles.titleColor[2])
    const titleLines = doc.splitTextToSize(note.title, styles.contentWidth)
    doc.text(titleLines, styles.marginLeft, currentY)
    currentY += titleLines.length * 8 + 10

    // Date selon le thème
    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')

    if (theme === "colorful") {
      // Badge coloré pour la date
      doc.setFillColor(75, 192, 192)
      doc.roundedRect(styles.marginLeft, currentY, 120, 12, 6, 6, "F")
      doc.setFont(styles.subtitleFont, "bold")
      doc.setFontSize(styles.subtitleSize)
      doc.setTextColor(255, 255, 255)
      doc.text(` ${createdDate}`, styles.marginLeft + 5, currentY + 8)
      currentY += 25
    } else {
      doc.setFont(styles.subtitleFont, "normal")
      doc.setFontSize(styles.subtitleSize)
      doc.setTextColor(styles.subtitleColor[0], styles.subtitleColor[1], styles.subtitleColor[2])
      doc.text(createdDate, styles.marginLeft, currentY)
      currentY += 15
    }

    return currentY
  }
}
