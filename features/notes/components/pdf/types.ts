"use client"

// Types pour les thèmes PDF
export type PdfThemeType = "classic" | "modern" | "colorful" | "minimal"

// Interface pour les options d'export PDF
export interface PdfExportOptions {
  useMarkdownFormat: boolean
  theme: PdfThemeType
}

// Interface pour les styles de thème
export interface ThemeStyles {
  titleFont: string
  titleSize: number
  titleColor: [number, number, number]
  subtitleFont: string
  subtitleSize: number
  subtitleColor: [number, number, number]
  textFont: string
  textSize: number
  textColor: [number, number, number]
  h1Size: number
  h1Color: [number, number, number]
  h2Size: number
  h2Color: [number, number, number]
  h3Size: number
  h3Color: [number, number, number]
  separatorColor: [number, number, number]
  codeBlockBg: [number, number, number]
  codeBlockBorder: [number, number, number]
  codeTextColor: [number, number, number]
  languageLabelBg: [number, number, number]
  languageLabelText: [number, number, number]
  marginLeft: number
  contentWidth: number
  // Propriétés pour les tableaux
  tableBgColor?: [number, number, number]
  tableBorderColor?: [number, number, number]
  tableCellPadding?: number
  tableLineHeight?: number
  tableFontSize?: number
}

// Interface pour un bloc de code
export interface CodeBlock {
  language: string
  content: string
  startLine: number
  endLine: number
}

// Interface pour le texte formaté
export interface FormattedText {
  text: string
  bold: boolean
  italic: boolean
}
