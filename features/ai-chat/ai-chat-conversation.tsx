"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Send, User, Bot, Search, PlusCircle, FileText } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/sidebar"
import { ChatSession } from "@/types/ai-chat"
import { AiChatService } from "@/services/ai-chat-service"

interface AiChatConversationProps {
  sessionId: string
}

export default function AiChatConversation({ sessionId }: AiChatConversationProps) {
  const [session, setSession] = useState<ChatSession | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AiChatService.getSessionById(sessionId)
        setSession(session)
      } catch (error) {
        setError("Erreur lors du chargement de la conversation")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  if (loading) {
    return <div>Chargement de la conversation...</div>
  }

  if (error) {
    return <div>Erreur : {error}</div>
  }

  if (!session) {
    return <div>Session non trouvée</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar className="w-64 hidden md:flex flex-col">
        <SidebarHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">SkillUp IA</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <Button className="w-full justify-start mb-4" variant="default">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle conversation
          </Button>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher..." className="pl-8 bg-muted/50" />
          </div>

          <div className="space-y-1">
            <h3 className="px-2 text-xs font-medium text-muted-foreground mb-2">Conversations récentes</h3>
            {[
              "Questions sur l'algorithmique",
              "Révision mathématiques",
              "Préparation examen",
              "Résumé du chapitre 2",
            ].map((title, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start text-sm h-auto py-2 px-2">
                <FileText className="mr-2 h-4 w-4" />
                <span className="truncate">{title}</span>
              </Button>
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Bob Dupont</p>
              <p className="text-xs text-muted-foreground truncate">bob@example.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b">
          <div className="container py-2 px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Questions sur l'algorithmique</h1>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {session.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`p-4 rounded-lg max-w-[70%] ${
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Posez une question ou demandez de l'aide..."
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              SkillUp IA est en version bêta. Les réponses peuvent contenir des inexactitudes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
