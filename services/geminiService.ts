
import { GoogleGenAI, Type } from "@google/genai";

// We create a new instance only when needed to ensure latest API keys
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideoContent = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this video metadata and suggest 3 high-impact viral "shorts" timestamps and hooks: ${description}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            start: { type: Type.STRING },
            end: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["title", "hook", "start", "end"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateVideoClip = async (prompt: string): Promise<string | undefined> => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic short video for social media: ${prompt}. Highly engaging, high quality, 1080p.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      // Return the link with the API key appended for fetching
      return `${downloadLink}&key=${process.env.API_KEY}`;
    }
  } catch (error) {
    console.error("Veo Video Generation Error:", error);
    throw error;
  }
  return undefined;
};

export const generateBudgetPlan = async (currentStats: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these campaign stats: ${currentStats}, suggest an optimized ad budget allocation across platforms.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                suggestedBudget: { type: Type.NUMBER },
                rationale: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
