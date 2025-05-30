import { ChatSession, ChatMessage, CreateChatSessionInput, UpdateChatSessionInput, SendMessageInput } from "@/types/ai-chat";
import { chatHistoryData } from "@/data/chat-history-data";
import { API_CONFIG } from "@/config/api";

// Utiliser la configuration centralisée
const config = {
  useApi: API_CONFIG.useApi,
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.chatSessions
};

/**
 * Service pour gérer les sessions de chat IA
 * Permet de basculer facilement entre les données fictives et l'API
 */
export const AiChatService = {
  /**
   * Récupère toutes les sessions de chat
   */
  async getAllChatSessions(): Promise<ChatSession[]> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/chat-sessions`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des sessions de chat");
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        return chatHistoryData; // Fallback aux données fictives en cas d'erreur
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(chatHistoryData);
  },

  /**
   * Récupère une session de chat par son ID
   */
  async getChatSessionById(id: string): Promise<ChatSession | undefined> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/chat-sessions/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la session de chat");
        }
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Fallback aux données fictives en cas d'erreur
        return chatHistoryData.find(session => session.id === id);
      }
    }
    
    // Utiliser les données fictives si l'API n'est pas activée
    return Promise.resolve(chatHistoryData.find(session => session.id === id));
  },

  /**
   * Crée une nouvelle session de chat
   */
  async createChatSession(sessionData: CreateChatSessionInput): Promise<ChatSession> {
    const now = new Date().toISOString();

    if (config.useApi) {
      try {
        const response = await fetch(`/api/chat-sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la création de la session de chat");
        }
        const res = await response.json()

        
        return res;
      } catch (error) {
        console.error("Erreur API:", error);
        // Créer une session fictive avec un ID généré
        const messages: ChatMessage[] = [];
        
        if (sessionData.initialMessage) {
          messages.push({
            id: "1",
            role: "user",
            content: sessionData.initialMessage,
            timestamp: now,
          });
          
          // Ajouter une réponse fictive de l'assistant
          messages.push({
            id: "2",
            role: "assistant",
            content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            timestamp: now,
          });
        }
        
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: sessionData.title,
          messages,
          createdAt: now,
          updatedAt: now,
        };
        
        return newSession;
      }
    }
    
    // Créer une session fictive avec un ID généré
    const messages: ChatMessage[] = [];
    
    if (sessionData.initialMessage) {
      messages.push({
        id: "1",
        role: "user",
        content: sessionData.initialMessage,
        timestamp: now,
      });
      
      // Ajouter une réponse fictive de l'assistant
      messages.push({
        id: "2",
        role: "assistant",
        content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        timestamp: now,
      });
    }
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: sessionData.title,
      messages,
      createdAt: now,
      updatedAt: now,
    };
    
    return Promise.resolve(newSession);
  },

  /**
   * Met à jour une session de chat existante
   */
  async updateChatSession(sessionData: UpdateChatSessionInput): Promise<ChatSession> {
    if (config.useApi) {
      try {
        const response = await fetch(`${config.baseUrl}${config.endpoints.detail(sessionData.id)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour de la session de chat");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Simuler une mise à jour avec les données fictives
        const existingSession = chatHistoryData.find(session => session.id === sessionData.id);
        if (!existingSession) {
          throw new Error("Session de chat non trouvée");
        }
        
        return {
          ...existingSession,
          ...sessionData,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    
    // Simuler une mise à jour avec les données fictives
    const existingSession = chatHistoryData.find(session => session.id === sessionData.id);
    if (!existingSession) {
      throw new Error("Session de chat non trouvée");
    }
    
    return Promise.resolve({
      ...existingSession,
      ...sessionData,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Supprime une session de chat
   */
  async deleteChatSession(id: string): Promise<boolean> {
    if (config.useApi) {
      try {
        const response = await fetch(`/api/chat-sessions/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la session de chat");
        }
        
        return true;
      } catch (error) {
        console.error("Erreur API:", error);
        return true; // Simuler une suppression réussie
      }
    }
    
    // Simuler une suppression réussie
    return Promise.resolve(true);
  },

  /**
   * Envoie un message dans une session de chat
   */
  async sendMessage(messageData: SendMessageInput): Promise<ChatMessage> {
    const now = new Date().toISOString();
    const { sessionId, ...messageDataWithoutSessionId } = messageData;

    const parsedMessage = {
      ...messageDataWithoutSessionId,
    };

    if (config.useApi) {
      try {
        const response = await fetch(`/api/chat-sessions/${messageData.sessionId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedMessage),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du message");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Créer un message fictif
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: messageData.content,
          timestamp: now,
          type: messageData.type,
          metadata: messageData.metadata
        };
        
        return userMessage;
      }
    }
    
    // Créer un message fictif
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageData.content,
      timestamp: now,
      type: messageData.type,
      metadata: messageData.metadata
    };
    
    return Promise.resolve(userMessage);
  },

  /**
   * Simule une réponse de l'assistant
   * @param sessionId - ID de la session de chat
   * @param messageId - ID du message de l'utilisateur
   * @param messageType - Type du message (optionnel)
   * @param metadata - Métadonnées du message (optionnel)
   */
  async getAssistantResponse(sessionId: string, messageId: string, messageType?: string, metadata?: any): Promise<ChatMessage> {
    const now = new Date().toISOString();
  const session = await this.getChatSessionById(sessionId);
    
    // Trouver le message spécifique par son ID
    const userMessageById = session?.messages.find(m => m.id === messageId);
    
    // Récupérer aussi le dernier message de l'utilisateur pour la compatibilité
    const lastUserMessage = session?.messages.filter(m => m.role === "user").pop();
    
    // Utiliser le message trouvé par ID ou le dernier message comme fallback
    const currentUserMessage = userMessageById || lastUserMessage;
    
    // Vérifier si le message de l'utilisateur est une note ou une liste de notes
    const isNoteMessage = currentUserMessage?.type === "note";
    const isNoteListMessage = currentUserMessage?.type === "note-list";
    
    if (config.useApi) {
      try {
        // Dans un environnement réel, cette requête serait gérée par le backend
        const response = await fetch(`/api/chat-sessions/${sessionId}/ai-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            messageId: messageId,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la génération de la réponse de l'assistant");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        // Générer une réponse fictive
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Je suis désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer plus tard.",
          timestamp: now,
        };
        
        return assistantMessage;
      }
    }
    
    // Générer une réponse fictive basée sur le message de l'utilisateur
    let responseContent = "Je suis désolé, je ne comprends pas votre demande. Pouvez-vous préciser ?";
    
    // Récupérer le contenu du message utilisateur
    const userMessageContent = currentUserMessage?.content || "";
    
    // Réponses spécifiques pour les notes
    if (isNoteMessage) {
      const noteAction = currentUserMessage?.metadata?.action;
      const noteTitle = currentUserMessage?.metadata?.noteTitle;
      const noteContent = currentUserMessage?.metadata?.noteContent;
      
      if (noteAction === "summarize" && noteContent) {
        // Générer une réponse basée sur le contenu réel de la note
        responseContent = `Voici un résumé de votre note "${noteTitle}" :\n\n`;
        responseContent += `Contenu de la note: ${noteContent}\n\n`;
        responseContent += "- Les points principaux de cette note sont extraits du contenu que vous avez fourni.\n";
        responseContent += "- J'ai analysé le contenu de votre note pour créer ce résumé.\n";
        responseContent += "- Pour approfondir ce sujet, vous pourriez explorer les concepts mentionnés dans votre note.\n\n";
        responseContent += "Avez-vous des questions spécifiques sur cette note ?";
      } else if (noteAction === "summarize" && !noteContent) {
        // Message d'erreur si le contenu de la note n'est pas disponible
        responseContent = `Pour que je puisse résumer la note "${noteTitle}", j'ai besoin de son contenu.\n\n`;
        responseContent += "Il semble que le contenu de la note ne soit pas disponible. Veuillez réessayer ou fournir le contenu manuellement.";
      } else if (noteAction === "review" && noteContent) {
        responseContent = `Passons en revue votre note "${noteTitle}" :\n\n`;
        responseContent += `Contenu de la note: ${noteContent}\n\n`;
        responseContent += "- Cette note couvre des concepts importants que j'ai identifiés dans votre contenu.\n";
        responseContent += "- Pour bien maîtriser ce sujet, essayez de réviser régulièrement les points clés.\n";
        responseContent += "- Voici quelques questions basées sur votre note pour tester votre compréhension.\n\n";
        responseContent += "Souhaitez-vous que je vous pose des questions pour vérifier votre compréhension ?";
      } else if (noteAction === "review" && !noteContent) {
        // Message d'erreur si le contenu de la note n'est pas disponible
        responseContent = `Pour que je puisse vous aider à réviser la note "${noteTitle}", j'ai besoin de son contenu.\n\n`;
        responseContent += "Il semble que le contenu de la note ne soit pas disponible. Veuillez réessayer ou fournir le contenu manuellement.";
      }
    } 
    // Réponses spécifiques pour les listes de notes
    else if (isNoteListMessage) {
      const noteAction = currentUserMessage?.metadata?.action;
      const notes = currentUserMessage?.metadata?.notes;
      
      if (noteAction === "list" && notes && notes.length > 0) {
        responseContent = "J'ai bien reçu la liste de vos notes. Que souhaitez-vous faire avec ces notes ?\n\n";
        responseContent += "Je peux :\n";
        responseContent += "- Résumer une note spécifique\n";
        responseContent += "- Vous aider à réviser un sujet\n";
        responseContent += "- Vous suggérer des connexions entre différentes notes\n\n";
        responseContent += "Dites-moi comment je peux vous aider !";
      } else if (notes && notes.length === 0) {
        responseContent = "Je vois que vous n'avez pas encore de notes. Souhaitez-vous que je vous aide à créer votre première note ?";
      }
    }
    // Réponses simples basées sur des mots-clés pour les messages texte normaux
    else {
      if (userMessageContent.toLowerCase().includes("bonjour") || userMessageContent.toLowerCase().includes("salut")) {
        responseContent = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
      } else if (userMessageContent.toLowerCase().includes("merci")) {
        responseContent = "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?";
      } else if (userMessageContent.toLowerCase().includes("objectif") || userMessageContent.toLowerCase().includes("objectifs")) {
        responseContent = "Les objectifs sont essentiels pour structurer votre apprentissage. Voulez-vous que je vous aide à définir des objectifs SMART ?";
      } else if (userMessageContent.toLowerCase().includes("tâche") || userMessageContent.toLowerCase().includes("tâches")) {
        responseContent = "La gestion des tâches est importante pour atteindre vos objectifs. Avez-vous besoin d'aide pour organiser vos tâches ?";
      } else if (userMessageContent.toLowerCase().includes("note") || userMessageContent.toLowerCase().includes("notes")) {
        responseContent = "Prendre des notes efficaces est crucial pour l'apprentissage. Souhaitez-vous des conseils sur la prise de notes ?";
      }
    }
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: now,
      // Conserver le type et les métadonnées pour la continuité de la conversation
      type: isNoteMessage || isNoteListMessage ? lastUserMessage?.type : undefined,
      metadata: isNoteMessage || isNoteListMessage ? lastUserMessage?.metadata : undefined
    };
    
    return Promise.resolve(assistantMessage);
  },
};
