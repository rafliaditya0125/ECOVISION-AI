/**
 * Represents the normalized result from any AI classification provider.
 */
export interface AIResult {
  /** Unique identifier matching the local knowledge engine keys */
  id: string;
  /** Confidence score of the prediction, typically between 0 and 100 */
  confidence: number;
  /** Raw or normalized label returned by the AI */
  detectedLabel: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string; // Optional base64 data URL
}

/**
 * The standard contract that all AI Providers (Mock, Gemini, OpenAI, Local, etc.) must implement.
 * This ensures the Provider/Strategy pattern is maintained.
 */
export interface AIProvider {
  /**
   * Analyzes an image and returns a normalized AIResult.
   * @param image - The file representing the image to analyze.
   * @returns A promise that resolves to an AIResult.
   */
  analyze(image: File): Promise<AIResult>;

  /**
   * Converses with the AI model using chat messages history.
   * @param messages - Array of chat history messages.
   * @returns The AI response text.
   */
  chat?(messages: ChatMessage[]): Promise<string>;
}
