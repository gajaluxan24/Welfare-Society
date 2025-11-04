
import { GoogleGenAI } from "@google/genai";

export const getFinancialInsights = async (summary: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a financial advisor for a small employee welfare society.
      Based on the following financial summary, provide 3-5 actionable insights or suggestions.
      Format the output as a Markdown list. Be encouraging and clear.

      Financial Summary:
      ${summary}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching financial insights:", error);
    if (error instanceof Error) {
        return `An error occurred while fetching insights: ${error.message}. Please ensure your API key is configured correctly.`;
    }
    return "An unknown error occurred while fetching insights.";
  }
};
