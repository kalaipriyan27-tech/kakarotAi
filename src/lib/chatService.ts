/**
 * Chat Service - Handles AI response generation
 * 
 * This module contains the getAIResponse function that returns AI responses.
 * Currently returns mocked responses, but can be easily replaced with a real API call.
 * 
 * To integrate with a real LLM API later:
 * 1. Replace the mock implementation with actual API call
 * 2. Add your API key handling (preferably via environment variables)
 * 3. Handle streaming responses if needed
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

/**
 * Generates an AI response for the given user message.
 * 
 * @param message - The user's input message
 * @returns Promise<string> - The AI's response text
 * 
 * TODO: Replace this mock implementation with real API call
 * Example future implementation:
 * 
 * const response = await fetch('YOUR_API_ENDPOINT', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${API_KEY}`,
 *   },
 *   body: JSON.stringify({
 *     model: 'your-model-name',
 *     messages: [{ role: 'user', content: message }],
 *   }),
 * });
 * const data = await response.json();
 * return data.choices[0].message.content;
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

  // Return a varied response based on message length for demo purposes
  const index = message.length % mockResponses.length;
  return mockResponses[index];
}

/**
 * Generates a unique ID for messages
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
