import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Severity } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    plantName: {
      type: Type.STRING,
      description: "The common name of the plant identified."
    },
    isHealthy: {
      type: Type.BOOLEAN,
      description: "Whether the plant appears healthy."
    },
    diseaseName: {
      type: Type.STRING,
      description: "Name of the disease if detected, or null if healthy.",
      nullable: true
    },
    severity: {
      type: Type.STRING,
      enum: [Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.NONE],
      description: "The estimated severity of the disease."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score of the diagnosis from 0 to 100."
    },
    description: {
      type: Type.STRING,
      description: "A brief 2-3 sentence explanation of the findings."
    },
    treatment: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended treatments or care steps."
    },
    regions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ymin: { type: Type.NUMBER, description: "Top coordinate (0-1000)" },
          xmin: { type: Type.NUMBER, description: "Left coordinate (0-1000)" },
          ymax: { type: Type.NUMBER, description: "Bottom coordinate (0-1000)" },
          xmax: { type: Type.NUMBER, description: "Right coordinate (0-1000)" }
        },
        required: ["ymin", "xmin", "ymax", "xmax"]
      },
      description: "List of bounding boxes (normalized 0-1000) identifying diseased areas or key features."
    }
  },
  required: ["plantName", "isHealthy", "severity", "confidence", "description", "treatment", "regions"]
};

export const analyzePlantImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this plant image. Identify the plant. If it is diseased, identify the disease, estimate severity, suggest treatments, and provide bounding box coordinates (0-1000 scale) for the affected areas to visualize as a heatmap. If healthy, provide coordinates for the main plant body."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert botanist and plant pathologist AI. Your goal is to accurately diagnose plant health issues from images."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
