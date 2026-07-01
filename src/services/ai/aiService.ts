import { AIProvider } from "./provider";
import { AIResult, ChatMessage } from "@/types/ai";

/**
 * The main AI Service layer for EcoVision AI.
 * 
 * Utilizes Dependency Injection (Provider/Strategy Pattern) to execute AI tasks.
 * This class follows the Open-Closed Principle (SOLID) as it can use any provider
 * (Mock, Gemini, OpenAI, etc.) without modifying this core service logic.
 */
export class AIService {
  private provider: AIProvider;

  /**
   * Injects the desired AI Provider into the service.
   * 
   * @param provider - An instance of a class implementing the AIProvider interface.
   */
  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  /**
   * Analyzes an image using the injected AI provider.
   * 
   * @param image - The image file to analyze.
   * @returns A normalized AIResult.
   * @throws Error if the image is missing or the provider fails.
   */
  public async analyze(image: File): Promise<AIResult> {
    try {
      if (!image) {
        throw new Error("No image provided for analysis.");
      }

      // Delegate the actual analysis to the specific provider implementation
      const result = await this.provider.analyze(image);
      
      return result;
    } catch (error) {
      console.error("AI Analysis failed in AIService:", error);
      throw error;
    }
  }

  /**
   * Generates a conversational response based on chat history.
   * 
   * @param messages - Array of chat messages.
   * @returns A promise resolving to the AI response text.
   */
  public async chat(messages: ChatMessage[]): Promise<string> {
    try {
      if (!messages || messages.length === 0) {
        throw new Error("No messages provided for chat.");
      }

      if (typeof this.provider.chat !== "function") {
        throw new Error("Current provider does not support chat operations.");
      }

      return await this.provider.chat(messages);
    } catch (error) {
      console.error("AI Chat failed in AIService:", error);
      throw error;
    }
  }
}
