"use client"

import { useEffect } from "react"
import { AiChatInterface } from "@/features/ai-chat/ai-chat-interface"
import { useAiChatStore } from "@/stores"

export default function AiChatPage() {
  const fetchChatSessions = useAiChatStore(state => state.fetchChatSessions)
  
  // Charger les sessions de chat au montage du composant
  useEffect(() => {
    fetchChatSessions()
  }, [])
  
  return (
    <AiChatInterface />
  )
}
