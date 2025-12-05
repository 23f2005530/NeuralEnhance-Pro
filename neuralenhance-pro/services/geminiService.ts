import { GoogleGenAI } from "@google/genai";
import { Resolution, AppMode } from '../types';

/**
 * Ensures a valid API key is selected.
 */
export const ensureApiKey = async (): Promise<boolean> => {
  const aistudio = (window as any).aistudio;
  if (aistudio && aistudio.hasSelectedApiKey) {
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await aistudio.openSelectKey();
      return true;
    }
    return true;
  }
  return false;
};

/**
 * Processes the image using Gemini 2.5 Flash Image (Free Tier Friendly).
 */
export const processImage = async (
  base64Data: string,
  mimeType: string,
  mode: AppMode,
  resolution: Resolution,
  customInstruction: string = ''
): Promise<string> => {
  
  // 1. Ensure Key is ready
  await ensureApiKey();

  // 2. Initialize Client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 3. Construct Prompt based on Mode and Resolution
  // Since Flash Image doesn't support 'imageSize' config, we use prompt engineering for detail.
  const qualityPrompt = resolution === Resolution.RES_16K 
    ? "Render in extremely high 16K resolution with microscopic detail and perfect sharpness."
    : resolution === Resolution.RES_8K
    ? "Render in 8K resolution with ultra-high detail."
    : resolution === Resolution.RES_4K
    ? "Render in 4K resolution with high detail."
    : "Render in standard high quality.";

  let prompt = "";
  if (mode === AppMode.ENHANCE) {
    prompt = `Upscale and enhance this image. ${qualityPrompt} Drastically improve clarity, texture details, lighting, and sharpness. Make it look like a high-end ultra-realistic photograph. ${customInstruction}`;
  } else {
    prompt = `Identify the main subject of this image and isolate it completely. Replace the entire background with a solid clean white color (#FFFFFF) to simulate background removal. Maintain ultra-high detail on the subject edges. ${customInstruction}`;
  }

  // 4. Call API
  // Using gemini-2.5-flash-image for broader access (Free tier compatible)
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            },
            { text: prompt }
        ]
      },
      config: {
        // Flash model supports aspectRatio but not imageSize.
        // We rely on the model's native resolution and prompt for detail.
        imageConfig: {
            aspectRatio: "1:1", 
        }
      }
    });

    // 5. Extract Image
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data returned from the model.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes("Requested entity was not found")) {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
            await aistudio.openSelectKey();
            throw new Error("API Key session refreshed. Please click Start again.");
        }
    }
    throw error;
  }
};