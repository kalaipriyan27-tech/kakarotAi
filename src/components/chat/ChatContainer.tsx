import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import TypingIndicator from "./TypingIndicator";
import { useConversations } from "@/hooks/useConversations";
import {
  ChatMessage as ChatMessageType,
  streamChat,
  generateMessageId,
} from "@/lib/chatService";
import { toast } from "sonner";

/**
 * ChatContainer - Main chat interface component
 * Manages chat state with localStorage persistence and multiple conversations
 */
const ChatContainer = () => {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    createConversation,
    addMessage,
    updateLastMessage,
    switchConversation,
    deleteConversation,
    clearAllConversations,
  } = useConversations();

  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current messages from active conversation
  const messages = activeConversation?.messages || [];

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Handles sending a new message with streaming response
   */
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: generateMessageId(),
      role: "user",
      content,
    };
    addMessage(userMessage);

    // Create placeholder assistant message
    const assistantMessageId = generateMessageId();
    const assistantMessage: ChatMessageType = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };
    addMessage(assistantMessage);

    // Show typing indicator
    setIsTyping(true);

    // Build messages array for API (without IDs)
    const apiMessages = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    let streamedContent = "";

    await streamChat({
      messages: apiMessages,
      onDelta: (delta) => {
        streamedContent += delta;
        updateLastMessage(streamedContent);
      },
      onDone: () => {
        setIsTyping(false);
      },
      onError: (error) => {
        setIsTyping(false);
        toast.error(error.message || "Failed to get AI response");
        // Update the message with error
        updateLastMessage("Sorry, I encountered an error. Please try again.");
      },
    });
  };

  const handleNewChat = () => {
    createConversation();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        onNewChat={handleNewChat}
        onSelectConversation={switchConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <ChatHeader
          onClearChat={clearAllConversations}
          hasMessages={conversations.length > 0}
        />

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
    </div>
  );
};

export default ChatContainer;
