import { GoogleGenAI } from "@google/genai";

// FIX: Use process.env.API_KEY as required by the coding guidelines. This resolves the TypeScript error with import.meta.env.
const API_KEY = process.env.API_KEY;

// Export a flag to check if the API key is set in the UI
export const isApiKeySet = !!API_KEY;

let ai: GoogleGenAI | null = null;
if (isApiKeySet) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateCardImage = async (): Promise<string> => {
  // Check for the AI instance and API Key at the time of the call
  if (!ai) {
    // FIX: Updated error message to refer to API_KEY instead of VITE_API_KEY for consistency.
    throw new Error("API_KEY chưa được cấu hình. Vui lòng thiết lập biến môi trường trong phần cài đặt deployment của bạn.");
  }

  try {
    const prompt = `A beautiful and elegant greeting card for Vietnamese Women's Day (October 20th). 
    Style: delicate watercolor painting. 
    Subject: A graceful arrangement of pink lotus flowers and white apricot blossoms (hoa mai trắng). 
    Background: Soft, pastel colors with a hint of morning light. 
    Feeling: Celebratory, gentle, and full of respect. 
    No text on the image. High resolution, artistic, and sophisticated.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4', // Portrait orientation for a card
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return imageUrl;
    } else {
      throw new Error("Không có hình ảnh nào được tạo ra.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    // Re-throw a more user-friendly error
    if (error instanceof Error && error.message.includes('API key')) {
         throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại.");
    }
    throw new Error("Không thể tạo hình ảnh từ Gemini API.");
  }
};