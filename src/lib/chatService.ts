/**
 * Chat Service - Handles AI response generation and conversation management
 * 
 * This module contains the getAIResponse function that returns AI responses.
 * Currently returns mocked responses, but can be easily replaced with a real API call.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Generates an AI response for the given user message.
 */
export async function getAIResponse(message: string): Promise<string> {
  // Simulate network delay (1-2 seconds)
  const delay = 1000 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Mock responses based on message content for variety
  const mockResponses = [
    "This is a placeholder response. The real AI response will be connected later.",
    "I'm a mock assistant response. Soon I'll be connected to a real AI model!",
    "Thanks for your message! This is simulated output for testing the chat interface.",
    "Great question! Once connected to a real LLM, I'll provide much more helpful responses.",
  ];

  const index = message.length % mockResponses.length;
  return mockResponses[index];
}

/**
 * Generates a unique ID for messages
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a unique ID for conversations
 */
export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a title from the first message
 */
export function generateConversationTitle(firstMessage: string): string {
  const maxLength = 30;
  if (firstMessage.length <= maxLength) {
    return firstMessage;
  }
  return firstMessage.substring(0, maxLength).trim() + "...";
}
