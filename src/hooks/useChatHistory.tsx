import { useState, useEffect } from "react";
import { ChatMessage } from "@/lib/chatService";

const STORAGE_KEY = "chat-history";

/**
 * Custom hook to manage chat history with localStorage persistence
 */
export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Load initial messages from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    return [];
  });

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [messages]);

  /**
   * Add a new message to the chat history
   */
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  /**
   * Clear all messages from chat history and localStorage
   */
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    clearHistory,
  };
}
