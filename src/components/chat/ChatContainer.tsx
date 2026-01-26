import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { useChatHistory } from "@/hooks/useChatHistory";
import {
  ChatMessage as ChatMessageType,
  getAIResponse,
  generateMessageId,
} from "@/lib/chatService";

/**
 * ChatContainer - Main chat interface component
 * Manages chat state with localStorage persistence
 */
const ChatContainer = () => {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Handles sending a new message
   * 1. Adds user message to chat
   * 2. Shows typing indicator
   * 3. Gets AI response
   * 4. Adds AI response to chat
   */
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateMessageId(),
      role: "user",
      content,
    };
    addMessage(userMessage);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response (mocked for now)
      const response = await getAIResponse(content);

      // Add AI response
      const assistantMessage: ChatMessageType = {
        id: generateMessageId(),
        role: "assistant",
        content: response,
      };
      addMessage(assistantMessage);
    } catch (error) {
      // Handle error gracefully
      const errorMessage: ChatMessageType = {
        id: generateMessageId(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <ChatHeader onClearChat={clearHistory} hasMessages={messages.length > 0} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto chat-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome message when no messages */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Start a conversation
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Send a message to begin chatting with the AI assistant. Your
                conversation will be saved automatically.
              </p>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
