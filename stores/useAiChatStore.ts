import { create } from 'zustand';
import { ChatSession, ChatMessage, CreateChatSessionInput, UpdateChatSessionInput, SendMessageInput } from '@/types/ai-chat';
import { CHAT_STATUS } from '@/data/chat-history';
import { AiChatService } from '@/services/ai-chat-service';

interface AiChatState {
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  loadingSessions: string[]; // IDs des sessions en cours de chargement
  error: string | null;
  
  // Actions
  fetchChatSessions: () => Promise<void>;
  getChatSessionById: (id: string) => Promise<ChatSession | undefined>;
  createChatSession: (sessionData: CreateChatSessionInput) => Promise<ChatSession>;
  updateChatSession: (id: string, status: keyof typeof CHAT_STATUS) => Promise<ChatSession>;
  deleteChatSession: (id: string) => Promise<boolean>;
  sendMessage: (messageData: SendMessageInput) => Promise<ChatMessage>;
  setCurrentSession: (session: ChatSession | null) => void;
  isSessionLoading: (sessionId: string) => boolean;
}

export const useAiChatStore = create<AiChatState>((set, get) => ({
  chatSessions: [],
  currentSession: null,
  isLoading: false,
  loadingSessions: [],
  error: null,

  fetchChatSessions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await AiChatService.getAllSessions();
      set({ chatSessions: data });
      // Ne pas retourner de données pour correspondre au type Promise<void>
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des sessions de chat";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getChatSessionById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const session = await AiChatService.getSessionById(id);
      return session;
    } catch (err) {
      const errorMessage = "Erreur lors du chargement de la session de chat";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createChatSession: async (sessionData: CreateChatSessionInput) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await AiChatService.createSession(sessionData.title);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Erreur lors de la création de la session de chat");
      }
      const newSession = response.data;
      set(state => ({ 
        chatSessions: [...state.chatSessions, newSession],
        currentSession: newSession
      }));
      return newSession;
    } catch (err) {
      const errorMessage = "Erreur lors de la création de la session de chat";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateChatSession: async (id: string, status: keyof typeof CHAT_STATUS) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await AiChatService.updateStatus(id, status);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Erreur lors de la mise à jour de la session de chat");
      }
      const updatedSession = response.data;
      set(state => {
        // Mettre à jour la liste des sessions
        const updatedSessions = state.chatSessions.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        );
        // Mettre à jour la session courante si c'est celle qui a été modifiée
        const updatedCurrentSession = state.currentSession && state.currentSession.id === updatedSession.id
          ? updatedSession
          : state.currentSession;
        return {
          chatSessions: updatedSessions,
          currentSession: updatedCurrentSession
        };
      });
      return updatedSession;
    } catch (err) {
      const errorMessage = "Erreur lors de la mise à jour de la session de chat";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteChatSession: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await AiChatService.deleteSession(id);
      set(state => {
        // Filtrer la liste des sessions
        const filteredSessions = state.chatSessions.filter(session => session.id !== id);
        
        // Réinitialiser la session courante si c'est celle qui a été supprimée
        const updatedCurrentSession = state.currentSession && state.currentSession.id === id
          ? null
          : state.currentSession;
        
        return {
          chatSessions: filteredSessions,
          currentSession: updatedCurrentSession
        };
      });
      
      return true;
    } catch (err) {
      const errorMessage = "Erreur lors de la suppression de la session de chat";

      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (messageData: SendMessageInput) => {
    // Ajouter l'ID de la session aux sessions en cours de chargement
    set(state => ({ 
      loadingSessions: [...state.loadingSessions, messageData.sessionId],
      error: null 
    }));

    try {
      // Envoyer le message de l'utilisateur
      const userMessage = await AiChatService.sendMessage(messageData);
      
      // Mettre à jour la session avec le nouveau message
      set(state => {
        // Mettre à jour toutes les sessions, pas seulement la session courante
        const updatedSessions = state.chatSessions.map(session => {
          if (session.id === messageData.sessionId) {
            // Vérification robuste pour s'assurer que messages est un tableau
            const currentMessages = Array.isArray(session.messages) 
              ? session.messages 
              : [];
            
            return {
              ...session,
              messages: [...currentMessages, userMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return session;
        });
        
        // Mettre à jour la session courante si c'est celle qui a été modifiée
        const updatedCurrentSession = state.currentSession && state.currentSession.id === messageData.sessionId
          ? {
              ...state.currentSession,
              messages: [...(Array.isArray(state.currentSession.messages) ? state.currentSession.messages : []), userMessage],
              updatedAt: new Date().toISOString(),
            }
          : state.currentSession;
        
        return {
          chatSessions: updatedSessions,
          currentSession: updatedCurrentSession
        };
      });
      
      // Obtenir la réponse de l'assistant en passant l'ID du message au lieu du contenu
      const assistantMessage = await AiChatService.getAssistantResponse(
        messageData.sessionId,
        userMessage.id, // Utiliser l'ID du message au lieu du contenu
        messageData.type,
        messageData.metadata
      );
      
      // Mettre à jour la session avec la réponse de l'assistant
      set(state => {
        // Mettre à jour toutes les sessions, pas seulement la session courante
        const updatedSessions = state.chatSessions.map(session => {
          if (session.id === messageData.sessionId) {
            // Vérification robuste pour s'assurer que messages est un tableau
            const currentMessages = Array.isArray(session.messages) 
              ? session.messages 
              : [];
            
            return {
              ...session,
              messages: [...currentMessages, assistantMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return session;
        });
        
        // Mettre à jour la session courante si c'est celle qui a été modifiée
        const updatedCurrentSession = state.currentSession && state.currentSession.id === messageData.sessionId
          ? {
              ...state.currentSession,
              messages: [...(Array.isArray(state.currentSession.messages) ? state.currentSession.messages : []), assistantMessage],
              updatedAt: new Date().toISOString(),
            }
          : state.currentSession;
        
        return {
          chatSessions: updatedSessions,
          currentSession: updatedCurrentSession
        };
      });
      
      return userMessage;
    } catch (err) {
      const errorMessage = "Erreur lors de l'envoi du message";

      set({ error: errorMessage });
      throw err;
    } finally {
      // Retirer l'ID de la session des sessions en cours de chargement
      set(state => ({ 
        loadingSessions: state.loadingSessions.filter(id => id !== messageData.sessionId) 
      }));
    }
  },

  setCurrentSession: (session: ChatSession | null) => {
    set({ currentSession: session });
  },
  
  // Vérifier si une session spécifique est en cours de chargement
  isSessionLoading: (sessionId: string) => {
    return get().loadingSessions.includes(sessionId);
  },
}));
