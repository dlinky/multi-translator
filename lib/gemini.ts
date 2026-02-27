import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

export async function generateTranslation(
  systemInstruction: string,
  userPrompt: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction,
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  return response.text();
}
