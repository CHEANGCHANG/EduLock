
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with process.env.API_KEY directly as per SDK requirements
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeSubmission(fileName: string, contentSnippet: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this student submission titled "${fileName}". Content snippet: "${contentSnippet}". 
                  Provide a professional summary, a score out of 100, and suggested feedback for the evaluator.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              isQualityGood: { type: Type.BOOLEAN }
            },
            required: ['summary', 'score', 'feedback', 'isQualityGood']
          }
        }
      });
      // Correctly access .text property from GenerateContentResponse
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      return null;
    }
  }

  async getAiAssistance(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the EduLock Intelligence Core. Help users manage their academic files and understand complex documents within the EduLock Cloud Drive."
        }
      });
      // Correctly access .text property from GenerateContentResponse
      return response.text;
    } catch (error) {
      console.error("Gemini assistance error:", error);
      return "An error occurred with the EduLock Intelligence system.";
    }
  }
}

export const gemini = new GeminiService();
