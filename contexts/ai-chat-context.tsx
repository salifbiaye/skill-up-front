"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ChatSession, ChatMessage, CreateChatSessionInput, UpdateChatSessionInput, SendMessageInput } from "@/types/ai-chat";
import { AiChatService } from "@/services/ai-chat-service";

interface AiChatContextType {
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  fetchChatSessions: () => Promise<void>;
  getChatSessionById: (id: string) => Promise<ChatSession | undefined>;
  createChatSession: (sessionData: CreateChatSessionInput) => Promise<ChatSession>;
  updateChatSession: (sessionData: UpdateChatSessionInput) => Promise<ChatSession>;
  deleteChatSession: (id: string) => Promise<boolean>;
  sendMessage: (messageData: SendMessageInput) => Promise<ChatMessage>;
  setCurrentSession: (session: ChatSession | null) => void;
}

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les sessions de chat au montage du composant
  useEffect(() => {
    fetchChatSessions();
  }, []);

  // Récupérer toutes les sessions de chat
  const fetchChatSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await AiChatService.getAllChatSessions();
      setChatSessions(data);
    } catch (err) {
      setError("Erreur lors du chargement des sessions de chat");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer une session de chat par son ID
  const getChatSessionById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await AiChatService.getChatSessionById(id);
      return session;
    } catch (err) {
      setError("Erreur lors du chargement de la session de chat");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle session de chat
  const createChatSession = async (sessionData: CreateChatSessionInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newSession = await AiChatService.createChatSession(sessionData);
      setChatSessions(prevSessions => [...prevSessions, newSession]);
      setCurrentSession(newSession);
      return newSession;
    } catch (err) {
      setError("Erreur lors de la création de la session de chat");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une session de chat existante
  const updateChatSession = async (sessionData: UpdateChatSessionInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedSession = await AiChatService.updateChatSession(sessionData);
      setChatSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        )
      );
      
      // Mettre à jour la session courante si c'est celle qui a été modifiée
      if (currentSession && currentSession.id === updatedSession.id) {
        setCurrentSession(updatedSession);
      }
      
      return updatedSession;
    } catch (err) {
      setError("Erreur lors de la mise à jour de la session de chat");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une session de chat
  const deleteChatSession = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AiChatService.deleteChatSession(id);
      setChatSessions(prevSessions => prevSessions.filter(session => session.id !== id));
      
      // Réinitialiser la session courante si c'est celle qui a été supprimée
      if (currentSession && currentSession.id === id) {
        setCurrentSession(null);
      }
      
      return true;
    } catch (err) {
      setError("Erreur lors de la suppression de la session de chat");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Envoyer un message dans une session de chat
  const sendMessage = async (messageData: SendMessageInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Envoyer le message de l'utilisateur
      const userMessage = await AiChatService.sendMessage(messageData);
      
      // Mettre à jour la session avec le nouveau message
      if (currentSession && currentSession.id === messageData.sessionId) {
        const updatedMessages = [...currentSession.messages, userMessage];
        const updatedSession = {
          ...currentSession,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
        setCurrentSession(updatedSession);
        
        // Mettre à jour la liste des sessions
        setChatSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          )
        );
      }
      
      // Obtenir la réponse de l'assistant
      const assistantMessage = await AiChatService.getAssistantResponse(
        messageData.sessionId,
        messageData.content
      );
      
      // Mettre à jour la session avec la réponse de l'assistant
      if (currentSession && currentSession.id === messageData.sessionId) {
        const updatedMessages = [...currentSession.messages, userMessage, assistantMessage];
        const updatedSession = {
          ...currentSession,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
        setCurrentSession(updatedSession);
        
        // Mettre à jour la liste des sessions
        setChatSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === updatedSession.id ? updatedSession : session
          )
        );
      }
      
      return userMessage;
    } catch (err) {
      setError("Erreur lors de l'envoi du message");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    chatSessions,
    currentSession,
    isLoading,
    error,
    fetchChatSessions,
    getChatSessionById,
    createChatSession,
    updateChatSession,
    deleteChatSession,
    sendMessage,
    setCurrentSession
  };

  return (
    <AiChatContext.Provider value={value}>
      {children}
    </AiChatContext.Provider>
  );
}

export function useAiChat() {
  const context = useContext(AiChatContext);
  
  if (context === undefined) {
    throw new Error("useAiChat doit être utilisé à l'intérieur d'un AiChatProvider");
  }
  
  return context;
}
