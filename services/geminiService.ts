
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCardImage = async (): Promise<string> => {
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
      throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate image from Gemini API.");
  }
};
