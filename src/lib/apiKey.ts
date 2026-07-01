/**
 * Helper to retrieve the Gemini API key on the client side.
 * Supports localStorage override "gemini_api_key" for custom testing keys
 * and falls back to the configured public environment variable.
 */
export function getClientApiKey(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("gemini_api_key") || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
}
