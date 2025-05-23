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
        const response = await fetch(`${config.baseUrl}${config.endpoints.base}`);
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
        const response = await fetch(`${config.baseUrl}${config.endpoints.detail(id)}`);
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
        const response = await fetch(`${config.baseUrl}${config.endpoints.base}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionData),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la création de la session de chat");
        }
        
        return await response.json();
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
        const response = await fetch(`${config.baseUrl}${config.endpoints.detail(id)}`, {
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
    
    if (config.useApi) {
      try {
        const response = await fetch(`${config.baseUrl}${config.endpoints.messages(messageData.sessionId)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
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
   */
  async getAssistantResponse(sessionId: string, userMessage: string, messageType?: string, metadata?: any): Promise<ChatMessage> {
    const now = new Date().toISOString();
    
    // Récupérer la session pour avoir le contexte complet
    const session = await this.getChatSessionById(sessionId);
    const lastUserMessage = session?.messages.filter(m => m.role === "user").pop();
    
    // Vérifier si le dernier message de l'utilisateur est une note ou une liste de notes
    const isNoteMessage = lastUserMessage?.type === "note";
    const isNoteListMessage = lastUserMessage?.type === "note-list";
    
    if (config.useApi) {
      try {
        // Dans un environnement réel, cette requête serait gérée par le backend
        const response = await fetch(`${config.baseUrl}${config.endpoints.aiResponse(sessionId)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            messageId: userMessage,
            messageType: messageType,
            metadata: metadata
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
    
    // Réponses spécifiques pour les notes
    if (isNoteMessage) {
      const noteAction = lastUserMessage?.metadata?.action;
      const noteTitle = lastUserMessage?.metadata?.noteTitle;
      
      if (noteAction === "summarize") {
        responseContent = `Voici un résumé de votre note "${noteTitle}" :\n\n`;
        responseContent += "- Les points principaux de cette note sont...\n";
        responseContent += "- Il est important de retenir que...\n";
        responseContent += "- Pour approfondir ce sujet, vous pourriez...\n\n";
        responseContent += "Avez-vous des questions spécifiques sur cette note ?";
      } else if (noteAction === "review") {
        responseContent = `Passons en revue votre note "${noteTitle}" :\n\n`;
        responseContent += "- Cette note couvre des concepts importants comme...\n";
        responseContent += "- Pour bien maîtriser ce sujet, essayez de...\n";
        responseContent += "- Voici quelques questions pour tester votre compréhension...\n\n";
        responseContent += "Souhaitez-vous que je vous pose des questions pour vérifier votre compréhension ?";
      }
    } 
    // Réponses spécifiques pour les listes de notes
    else if (isNoteListMessage) {
      const noteAction = lastUserMessage?.metadata?.action;
      const notes = lastUserMessage?.metadata?.notes;
      
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
      if (userMessage.toLowerCase().includes("bonjour") || userMessage.toLowerCase().includes("salut")) {
        responseContent = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
      } else if (userMessage.toLowerCase().includes("merci")) {
        responseContent = "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?";
      } else if (userMessage.toLowerCase().includes("objectif") || userMessage.toLowerCase().includes("objectifs")) {
        responseContent = "Les objectifs sont essentiels pour structurer votre apprentissage. Voulez-vous que je vous aide à définir des objectifs SMART ?";
      } else if (userMessage.toLowerCase().includes("tâche") || userMessage.toLowerCase().includes("tâches")) {
        responseContent = "La gestion des tâches est importante pour atteindre vos objectifs. Avez-vous besoin d'aide pour organiser vos tâches ?";
      } else if (userMessage.toLowerCase().includes("note") || userMessage.toLowerCase().includes("notes")) {
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
