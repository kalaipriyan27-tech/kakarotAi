import { useState, useEffect, useCallback } from "react";
import {
  Conversation,
  ChatMessage,
  generateConversationId,
  generateConversationTitle,
} from "@/lib/chatService";

const STORAGE_KEY = "chat-conversations";

/**
 * Custom hook to manage multiple conversations with localStorage persistence
 */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
    return [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const convs = JSON.parse(stored);
        if (convs.length > 0) {
          return convs[0].id;
        }
      }
    } catch (error) {
      console.error("Failed to get active conversation:", error);
    }
    return null;
  });

  // Persist conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to save conversations:", error);
    }
  }, [conversations]);

  // Get the active conversation
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  ) || null;

  // Create a new conversation
  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateConversationId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);

    return newConversation.id;
  }, []);

  // Add a message to the active conversation
  const addMessage = useCallback(
    (message: ChatMessage) => {
      if (!activeConversationId) {
        // Create a new conversation if none exists
        const newId = generateConversationId();
        const title = message.role === "user" 
          ? generateConversationTitle(message.content)
          : "New Chat";

        const newConversation: Conversation = {
          id: newId,
          title,
          messages: [message],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newId);
        return;
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            const updatedMessages = [...conv.messages, message];
            // Update title if this is the first user message
            const title =
              conv.messages.length === 0 && message.role === "user"
                ? generateConversationTitle(message.content)
                : conv.title;

            return {
              ...conv,
              title,
              messages: updatedMessages,
              updatedAt: Date.now(),
            };
          }
          return conv;
        })
      );
    },
    [activeConversationId]
  );

  // Update the last message in the active conversation (for streaming)
  const updateLastMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) return;

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId && conv.messages.length > 0) {
            const updatedMessages = [...conv.messages];
            const lastIndex = updatedMessages.length - 1;
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              content,
            };

            return {
              ...conv,
              messages: updatedMessages,
              updatedAt: Date.now(),
            };
          }
          return conv;
        })
      );
    },
    [activeConversationId]
  );

  // Switch to a different conversation
  const switchConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback(
    (conversationId: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((conv) => conv.id !== conversationId);

        // If we deleted the active conversation, switch to another
        if (conversationId === activeConversationId) {
          if (filtered.length > 0) {
            setActiveConversationId(filtered[0].id);
          } else {
            setActiveConversationId(null);
          }
        }

        return filtered;
      });
    },
    [activeConversationId]
  );

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    addMessage,
    updateLastMessage,
    switchConversation,
    deleteConversation,
    clearAllConversations,
  };
}
