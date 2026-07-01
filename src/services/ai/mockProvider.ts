import { AIProvider } from "./provider";
import { AIResult, ChatMessage } from "@/types/ai";

/**
 * A mock implementation of the AIProvider.
 * Used for development, testing, and UI building without requiring actual AI API keys.
 */
export class MockProvider implements AIProvider {
  /**
   * Simulates an AI image analysis.
   * Always returns a dummy "plastic-pet" result with 96% confidence as requested.
   * 
   * @param image - The image file to "analyze" (ignored in mock).
   * @returns A promise resolving to a mock AIResult.
   */
  public async analyze(image: File): Promise<AIResult> {
    // Simulate network latency (e.g., 2 seconds) for realistic UI loading states
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      id: "plastic-pet", // Maps perfectly to our local knowledge engine
      confidence: 96,
      detectedLabel: "plastic-pet",
    };
  }

  /**
   * Simulates a conversational response from the mock provider.
   *
   * @param messages - Array of chat messages.
   * @returns A promise resolving to a simulated response.
   */
  public async chat(messages: ChatMessage[]): Promise<string> {
    // Simulate network latency (e.g. 1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.image) {
      return "Berdasarkan foto sampah yang Anda kirimkan, objek tersebut teridentifikasi sebagai botol plastik PET (Polyethylene Terephthalate).\n\n" +
             "🌱 Kategori: Plastik Daur Ulang (Tempat Sampah Kuning)\n" +
             "⏳ Waktu terurai: 450 tahun\n\n" +
             "Langkah Pengelolaan:\n" +
             "1. Kosongkan sisa cairan di dalam botol.\n" +
             "2. Bilas sebentar dengan air bersih.\n" +
             "3. Lepaskan tutup botol dan label plastik di sekelilingnya.\n" +
             "4. Remas botol hingga pipih untuk menghemat ruang tempat sampah daur ulang.";
    }

    const userMessage = lastMessage?.content.toLowerCase() || "";

    if (userMessage.includes("plastik") || userMessage.includes("plastic")) {
      return "Botol plastik jenis PET (seperti botol air mineral) dapat didaur ulang menjadi pakaian, tas, atau botol baru. Sebelum membuangnya, pastikan Anda telah mengosongkan isinya, membilasnya, dan melepaskan label serta tutupnya.";
    }

    if (userMessage.includes("kertas") || userMessage.includes("paper") || userMessage.includes("karton") || userMessage.includes("cardboard")) {
      return "Kertas dan kardus sangat mudah didaur ulang. Kertas biasanya terurai dalam waktu 2-6 minggu di alam terbuka. Pastikan kertas dalam keadaan kering dan tidak berminyak (seperti bekas bungkus pizza) sebelum dimasukkan ke tempat sampah daur ulang.";
    }

    if (userMessage.includes("organik") || userMessage.includes("organic") || userMessage.includes("makanan") || userMessage.includes("food")) {
      return "Sampah organik seperti sisa makanan atau daun kering sebaiknya diolah menjadi kompos. Kompos ini sangat berguna untuk menyuburkan tanah dan mengurangi produksi gas metana di TPA.";
    }

    if (userMessage.includes("halo") || userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("siapa")) {
      return "Halo! Saya adalah Asisten EcoVision AI. Saya siap membantu menjawab pertanyaan Anda seputar pemilahan sampah, cara mendaur ulang, dan kelestarian lingkungan. Silakan tanyakan hal-hal terkait topik tersebut!";
    }

    // Safety Boundary check in Mock Provider
    const isOffTopic = !userMessage.includes("sampah") && 
                       !userMessage.includes("daur") && 
                       !userMessage.includes("recycle") && 
                       !userMessage.includes("lingkungan") &&
                       !userMessage.includes("eco") && 
                       !userMessage.includes("co2") &&
                       !userMessage.includes("plastik") &&
                       !userMessage.includes("kertas") &&
                       !userMessage.includes("kardus") &&
                       !userMessage.includes("organik") &&
                       !userMessage.includes("glass") &&
                       !userMessage.includes("kaca") &&
                       !userMessage.includes("kaleng") &&
                       !userMessage.includes("metal") &&
                       !userMessage.includes("battery") &&
                       !userMessage.includes("baterai");

    if (isOffTopic) {
      return "Maaf, sebagai asisten EcoVision AI, saya hanya dapat menjawab pertanyaan yang berhubungan dengan pengelolaan sampah, daur ulang, dan kelestarian lingkungan. Ada yang bisa saya bantu terkait topik tersebut?";
    }

    return "Terima kasih atas pertanyaannya! Menjaga kelestarian lingkungan dimulai dari langkah kecil seperti memilah sampah dengan benar. Apakah ada bahan sampah tertentu yang ingin Anda tanyakan cara pengolahannya?";
  }
}
