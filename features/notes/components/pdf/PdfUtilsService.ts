"use client"

import { commonEmojis, emojiMap } from "../EmojiMap"

/**
 * Service utilitaire pour les exports PDF
 */
export class PdfUtilsService {
  /**
   * Remplace les emojis par du texte
   */
  static processEmojis(text: string): string {
    let processedText = text
    for (const [emoji, replacement] of Object.entries(commonEmojis)) {
      processedText = processedText.replace(new RegExp(emoji, 'g'), replacement)
    }

    return Array.from(processedText).map(char => {
      if (commonEmojis[char]) {
        return commonEmojis[char]
      }
      return emojiMap[char] || char
    }).join('')
  }

  /**
   * Génère un nom de fichier sécurisé pour le PDF
   */
  static generateSafeFilename(title: string, theme: string, isMarkdown: boolean = false): string {
    const filename = title
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .substring(0, 50)
    
    const suffix = isMarkdown ? `_${theme}_markdown.pdf` : `_${theme}.pdf`
    return `${filename || 'note'}${suffix}`
  }
}
