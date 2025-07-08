import { ChatSession, ChatMessage, CreateChatSessionInput, UpdateChatSessionInput, SendMessageInput } from "@/types/ai-chat";
import { API_CONFIG } from "@/config/api";
import { CHAT_STATUS } from "@/data/chat-history";

// Utiliser la configuration centralisée
const config = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: API_CONFIG.endpoints.chat
};

/**
 * Service pour gérer le chat IA
 */
export const AiChatService = {
  /**
   * Récupère toutes les sessions de chat
   */
  async getAllSessions(): Promise<ChatSession[]> {
    try {
      const response = await fetch(`/api/chat-sessions`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des sessions de chat");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return [];
    }
  },

  /**
   * Récupère une session de chat par son ID
   */
  async getSessionById(id: string): Promise<ChatSession | undefined> {
    try {
      const response = await fetch(`/api/chat-sessions/${id}`);
      if (!response.ok) {
        throw new Error("Session de chat non trouvée");
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      return undefined;
    }
  },

  /**
   * Crée une nouvelle session de chat
   */
  async createSession(title: string): Promise<{ success: boolean; data?: ChatSession; error?: string }> {
    try {
      const response = await fetch(`/api/chat-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la création de la session";
        return {
          success: false,
          error: errorMessage
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  },

  /**
   * Ajoute un message à une session de chat
   */
  async addMessage(sessionId: string, message: Omit<ChatMessage, "id">): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de l'ajout du message";
        return {
          success: false,
          error: errorMessage
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  },

  /**
   * Obtient une réponse de l'IA
   */
  async getAiResponse(sessionId: string, messageId: string): Promise<{ success: boolean; data?: ChatMessage; error?: string }> {
    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/ai-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la génération de la réponse IA";
        return {
          success: false,
          error: errorMessage
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  },

  /**
   * Met à jour le statut d'une session de chat
   */
  async updateStatus(id: string, status: keyof typeof CHAT_STATUS): Promise<{ success: boolean; data?: ChatSession; error?: string }> {
    try {
      const response = await fetch(`/api/chat-sessions/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la mise à jour du statut";
        return {
          success: false,
          error: errorMessage
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
  },

  /**
   * Supprime une session de chat
   */
  async deleteSession(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/chat-sessions/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || "Erreur lors de la suppression de la session";
        return {
          success: false,
          error: errorMessage
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Erreur API:", error);
      return {
        success: false,
        error: "Erreur lors de la communication avec le serveur"
      };
    }
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

    try {
      const response = await fetch(`/api/chat-sessions/${sessionId}/messages`, {
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
    const session = await this.getSessionById(sessionId);
    
    // Trouver le message spécifique par son ID
    const userMessageById = session?.messages.find(m => m.id === messageId);
    
    // Récupérer aussi le dernier message de l'utilisateur pour la compatibilité
    const lastUserMessage = session?.messages.filter(m => m.role === "user").pop();
    
    // Utiliser le message trouvé par ID ou le dernier message comme fallback
    const currentUserMessage = userMessageById || lastUserMessage;
    
    // Vérifier si le message de l'utilisateur est une note ou une liste de notes
    const isNoteMessage = currentUserMessage?.type === "note";
    const isNoteListMessage = currentUserMessage?.type === "note-list";
    
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
