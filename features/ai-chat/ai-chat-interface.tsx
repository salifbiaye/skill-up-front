"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Send, Search, PlusCircle, FileText, ChevronRight, X, MoreVertical, Bot, User, Trash, BookOpen, ListChecks, BookMarked, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAiChatStore } from "@/stores"
import { useNotesStore } from "@/stores/useNotesStore"
import { SendMessageInput } from "@/types/ai-chat"
import { toast } from "sonner"
import { NoteMessage } from "@/components/ai-chat/note-message"
import { NoteListMessage } from "@/components/ai-chat/note-list-message"
import {AiChatHeader} from "@/features/ai-chat/ai-chat-header"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";

export function AiChatInterface() {
  // Utiliser le store Zustand pour AI Chat
  const chatSessions = useAiChatStore(state => state.chatSessions)
  const currentSession = useAiChatStore(state => state.currentSession)
  const isLoading = useAiChatStore(state => state.isLoading)
  const error = useAiChatStore(state => state.error)
  const fetchChatSessions = useAiChatStore(state => state.fetchChatSessions)
  const createChatSession = useAiChatStore(state => state.createChatSession)
  const deleteChatSession = useAiChatStore(state => state.deleteChatSession)
  const sendChatMessage = useAiChatStore(state => state.sendMessage)
  const setCurrentSession = useAiChatStore(state => state.setCurrentSession)
  const isSessionLoading = useAiChatStore(state => state.isSessionLoading)
  
  // Utiliser le store Zustand pour les notes
  const notes = useNotesStore(state => state.notes)
  const fetchNotes = useNotesStore(state => state.fetchNotes)
  const getNoteById = useNotesStore(state => state.getNoteById)
  
  // États locaux
  const [searchQuery, setSearchQuery] = useState("")
  const [input, setInput] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedNoteAction, setSelectedNoteAction] = useState<"summarize" | "review" | "quiz">("summarize")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Charger les sessions de chat et les notes au chargement du composant
  useEffect(() => {
    fetchChatSessions()
    fetchNotes()
  }, [fetchChatSessions, fetchNotes])

  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  // Filtrer les sessions de chat en fonction de la recherche
  const filteredSessions = chatSessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filtrer les sessions en fonction de l'onglet actif
  const filteredByTabSessions = activeTab === "recent" 
    ? filteredSessions.slice(0, 5) // Prendre les 5 plus récentes
    : filteredSessions

  // Créer une nouvelle session de chat
  const createNewChatSession = async () => {
    if (!newChatTitle.trim()) return
    
    try {
      await createChatSession({
        title: newChatTitle,
      })
      
      setNewChatTitle("")
      setIsCreateModalOpen(false)
      toast.success("Nouvelle session de chat créée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la création de la session de chat")
    }
  }
  
  // Envoyer un message avec une note dans la session actuelle
  const sendNoteMessageInCurrentSession = async (noteId: string, action: "summarize" | "review" | "quiz") => {
    try {
      // Vérifier si une session est active
      if (!currentSession) {
        toast.error("Aucune session de chat active");
        return;
      }
      
      const note = await getNoteById(noteId);
      if (!note) {
        toast.error("Note introuvable");
        return;
      }
      
      // Préparer le message initial basé sur l'action
      let initialMessage = "";
      if (action === "summarize") {
        initialMessage = `Peux-tu résumer cette note pour moi?`;
      } else if (action === "review") {
        initialMessage = `Peux-tu m'aider à réviser cette note?`;
      } else if (action === "quiz") {
        initialMessage = `Peux-tu m'aider à créer un quiz sur cette note?`;
      }
      
      // Envoyer un message avec la note comme contenu spécial dans la session actuelle
      await sendChatMessage({
        sessionId: currentSession.id,
        content: initialMessage,
        type: "note",
        metadata: {
          noteId: note.id,
          noteTitle: note.title,
          noteContent: note.content,
          action: action
        }
      });
      
      setIsNoteModalOpen(false);
      toast.success(`Note "${note.title}" ajoutée à la conversation`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la note à la conversation");
    }
  };
  
  // Créer une nouvelle session de chat avec une note
  const createChatWithNote = async (noteId: string, action: "summarize" | "review" | "quiz") => {
    try {
      // Si une session est déjà active, utiliser cette session au lieu d'en créer une nouvelle
      if (currentSession) {
        await sendNoteMessageInCurrentSession(noteId, action);
        return;
      }
      
      const note = await getNoteById(noteId);
      if (!note) {
        toast.error("Note introuvable");
        return;
      }
      
      // Créer une nouvelle session avec un titre basé sur l'action et la note
      let sessionTitle = "";
      if (action === "summarize") {
        sessionTitle = `Résumé: ${note.title}`;
      } else if (action === "review") {
        sessionTitle = `Révision: ${note.title}`;
      } else if (action === "quiz") {
        sessionTitle = `Quiz: ${note.title}`;
      }
      
      // S'assurer que la session est correctement initialisée avec un tableau de messages vide
      const newSession = await createChatSession({
        title: sessionTitle,
      });
      
      // Vérification supplémentaire pour s'assurer que messages est un tableau
      if (!Array.isArray(newSession.messages)) {
        console.warn("La propriété messages n'est pas un tableau, initialisation d'un tableau vide");
        newSession.messages = [];
      }
      
      // Préparer le message initial basé sur l'action
      let initialMessage = "";
      if (action === "summarize") {
        initialMessage = `Peux-tu résumer cette note pour moi?`;
      } else if (action === "review") {
        initialMessage = `Peux-tu m'aider à réviser cette note?`;
      }else if (action === "quiz") {
        initialMessage = `Peux-tu m'aider à créer un quiz sur cette note?`;
      }

      // Envoyer un message avec la note comme contenu spécial
      await sendChatMessage({
        sessionId: newSession.id,
        content: initialMessage,
        type: "note",
        metadata: {
          noteId: note.id,
          noteTitle: note.title,
          noteContent: note.content,
          action: action
        }
      });
      
      setIsNoteModalOpen(false);
      toast.success("Nouvelle session de chat créée avec la note");
    } catch (error) {
      toast.error("Erreur lors de la création de la session de chat");
    }
  };
  


  // Supprimer une session de chat
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId)
      toast.success("Session de chat supprimée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression de la session de chat")
    }
  }

  // Envoyer un message dans la session de chat 
  const handleSendMessage = () => {
    if (!input.trim() || !currentSession || isSessionLoading(currentSession.id)) return

    // Préparer les données du message
    const messageData: SendMessageInput = {
      sessionId: currentSession.id,
      content: input
    }

    // Envoyer le message via le contexte
    sendChatMessage(messageData)

    // Réinitialiser l'input
    setInput("")
  }

  // Gérer l'appui sur la touche Entrée dans le champ de saisie
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // États pour gérer l'affichage des éléments de l'interface
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showNotesReferences, setShowNotesReferences] = useState(false);
  
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Bouton pour afficher la sidebar sur mobile */}

      <button 
        className="fixed left-4 bottom-20 z-50 md:hidden bg-primary text-white rounded-full p-2 shadow-md"
        onClick={() => setShowMobileSidebar(true)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar avec la liste des conversations */}
      <Sidebar 
        className={`w-72 flex-col fixed h-full border-r z-50 transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:flex`}
      >
        <SidebarHeader className="flex items-center justify-between border-none p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">SkillUp IA</span>
          </div>
          {/* Bouton pour fermer la sidebar sur mobile */}
          <button 
            className="md:hidden h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted"
            onClick={() => setShowMobileSidebar(false)}
          >
            <X className="h-4 w-4" />
          </button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 w-8" variant="ghost">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle conversation</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Titre de la conversation"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button onClick={createNewChatSession} disabled={!newChatTitle.trim() || isLoading}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarHeader>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            className="w-full justify-start mb-4"
            variant="default"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle conversation
          </Button>
        </div>

        <SidebarContent className="flex-1 overflow-y-auto px-2">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="recent">Récentes</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading && chatSessions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">Chargement des conversations...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-1 pr-2">
                {filteredByTabSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-3 cursor-pointer rounded-md hover:bg-muted ${currentSession?.id === session.id ? "bg-muted" : ""}`}
                  >
                    <div 
                      className="flex-1"
                      onClick={() => setCurrentSession(session)}
                    >
                      <div className="truncate max-w-[180px]" title={session.title}>
                        {session.title.length > 25 ? `${session.title.substring(0, 25)}...` : session.title}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-60 hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            <p>SkillUp IA - Version Beta</p>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Contenu principal avec marge pour le sidebar */}
      <div className="flex-1 flex flex-col ml-0 md:ml-72 h-[calc(100vh-4rem)]">
        {currentSession ? (
            <div className="relative overflow-hidden  border-b  bg-blue-100 dark:bg-slate-900 p-6  text-blue-800 dark:text-white">
              <div className="absolute inset-0 dark:bg-black/30"></div>
              <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-blue-800/20 dark:bg-white/10 blur-xl"></div>
              <div className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-blue-800/20 dark:bg-white/10 blur-lg"></div>

              <div className="flex items-center">
                <h2 className="text-2xl font-semibold truncate">{currentSession.title}</h2>
              </div>
            </div>
        ) : null}

        {/* Zone de conversation */}
        <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/20 p-4"
        >
          {!currentSession ? (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-2xl w-full px-4 md:px-0 py-4 text-center">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">Bienvenue sur SkillUp IA</h1>
                  <p className="text-muted-foreground">Votre assistant d'apprentissage personnel</p>
                </div>

                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Créer une nouvelle conversation</span>
                  </div>
                </div>

                <Button
                  className="mx-auto"
                  variant="default"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nouvelle conversation
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {currentSession && currentSession.messages && currentSession.messages.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Commencez la conversation</h3>
                  <p className="text-muted-foreground mb-6">Posez une question ou demandez de l'aide</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 justify-start text-left"
                      onClick={() => setInput("Résume mes notes sur l'algorithmique")}
                    >
                      <div>
                        <p className="font-medium">Résumer mes notes</p>
                        <p className="text-xs dark:text-muted-foreground mt-1">
                          Générer un résumé de mes notes sur l'algorithmique
                        </p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 justify-start text-left"
                      onClick={() => setInput("Crée des questions de révision sur les algorithmes de tri")}
                    >
                      <div>
                        <p className="font-medium">Questions de révision</p>
                        <p className="text-xs dark:text-muted-foreground mt-1">
                          Créer des questions pour tester mes connaissances
                        </p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {currentSession?.messages && [...currentSession.messages]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map((message) => {
                    // Afficher un message de type note
                    if (message.type === "note" && message.metadata?.noteId && message.metadata?.noteTitle) {
                      const note = notes.find(n => n.id === message.metadata?.noteId);
                      if (note) {
                        return (
                          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                            {message.role === "user" && (
                              <div className="mr-3 mt-0.5">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                            <div className="max-w-[85%]">
                              <div className="mb-2 text-sm">{message.content}</div>
                              <NoteMessage 
                                title={message.metadata?.noteTitle || note.title} 
                                content={message.metadata?.noteContent || note.content} 
                                noteId={message.metadata?.noteId || note.id} 
                                timestamp={new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              />
                            </div>
                            {message.role === "assistant" && (
                              <div className="ml-3 mt-0.5">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-muted-foreground/10">
                                    <Bot className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                          </div>
                        );
                      }
                    }
                    
                    // Afficher un message de type liste de notes
                    if (message.type === "note-list" && message.metadata?.notes) {
                      return (
                        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                          {message.role === "user" && (
                            <div className="mr-3 mt-0.5">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                          <div className="max-w-[85%]">
                            <div className="mb-2 text-sm">{message.content}</div>
                            <NoteListMessage 
                              notes={message.metadata.notes} 
                              action={message.metadata.action || "list"} 
                              timestamp={new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            />
                          </div>
                          {message.role === "assistant" && (
                            <div className="ml-3 mt-0.5">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-muted-foreground/10">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Afficher un message texte normal avec support Markdown
                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div
                          className={`flex max-w-[80%] items-start rounded-lg px-4 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          <div className="mr-3 mt-0.5">
                            {message.role === "user" ? (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-muted-foreground/10">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          <div className="relative w-full">
                            <div className="text-sm prose prose-sm max-w-full dark:prose-invert overflow-hidden markdown-chat px-2 py-1">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <div className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              {message.role === "assistant" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 ml-2 opacity-70 hover:opacity-100"
                                  onClick={() => {
                                    navigator.clipboard.writeText(message.content);
                                    toast.success("Message copié dans le presse-papier");
                                  }}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {currentSession && isSessionLoading(currentSession.id) && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] items-start rounded-lg border border-border/50 bg-background px-4 py-2">
                        <div className="mr-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-muted-foreground/10">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boîte de dialogue de sélection de notes */}
        <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sélectionner une note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={selectedNoteAction === "summarize" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setSelectedNoteAction("summarize")}
                  >
                    <BookOpen className="h-8 w-8 text-primary-foreground" />
                    <span className="text-xs">Résumer</span>
                  </Button>
                  <Button
                    variant={selectedNoteAction === "review" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setSelectedNoteAction("review")}
                  >
                    <BookMarked className="h-8 w-8 text-primary-foreground" />
                    <span className="text-xs">Réviser</span>
                  </Button>
                  <Button
                    variant={selectedNoteAction === "quiz" ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setSelectedNoteAction("quiz")}
                  >
                    <ListChecks className="h-8 w-8 text-primary-foreground" />
                    <span className="text-xs">Quiz</span>
                  </Button>
                </div>
              </div>

              {(
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {notes.length === 0 ? (
                      <p className="text-center text-muted-foreground">Aucune note disponible</p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
                          onClick={() => createChatWithNote(note.id, selectedNoteAction)}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{note.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {note.content.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Bloc de références aux notes (collapsible) */}
        {currentSession && currentSession.messages && Array.isArray(currentSession.messages) && (() => {
          // Compter les notes référencées
          const referencedNoteIds = Array.from(new Set(
            currentSession.messages
              .filter(msg => {
                const hasNoteType = msg.type === "note";
                const hasNoteId = msg.metadata && typeof msg.metadata === 'object' && 'noteId' in msg.metadata;
                return hasNoteType && hasNoteId;
              })
              .map(msg => msg.metadata?.noteId as string)
          ));
          
          // Ne rien afficher s'il n'y a pas de notes référencées
          if (referencedNoteIds.length === 0) return null;
          
          return (
            <div className="border-t border-border/50 bg-muted/20 py-2">
              <div className="max-w-3xl mx-auto px-4">
                <button 
                  onClick={() => setShowNotesReferences(!showNotesReferences)}
                  className="w-full flex items-center justify-between py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{referencedNoteIds.length} note{referencedNoteIds.length > 1 ? 's' : ''} référencée{referencedNoteIds.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{showNotesReferences ? 'Masquer' : 'Afficher'}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${showNotesReferences ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                
                {showNotesReferences && (
                  <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {referencedNoteIds.map(noteId => {
                      // Trouver le premier message qui référence cette note
                      const msg = currentSession.messages.find(m => 
                        m.metadata && typeof m.metadata === 'object' && 'noteId' in m.metadata && m.metadata.noteId === noteId
                      );
                      
                      const noteTitle = msg?.metadata?.noteTitle as string;
                      const note = notes.find(n => n.id === noteId);
                      
                      return (
                        <div key={noteId} className="flex items-center justify-between rounded-md border border-border/50 p-2 bg-card">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{noteTitle || (note?.title || "Note sans titre")}</span>
                          </div>
                          <Link href={`/notes/${noteId}`} passHref>
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                              <ExternalLink className="h-3 w-3" />
                              Voir
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        
        {/* Zone de saisie */}
        <div className="p-4 border-t bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsNoteModalOpen(true)}
                disabled={!currentSession}
                className="bg-muted/50"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Posez une question ou demandez de l'aide..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!currentSession || (currentSession && isSessionLoading(currentSession.id))}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || !currentSession}
              >
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