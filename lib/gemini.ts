import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const MODEL_NAME = "gemini-2.5-flash";

export async function generateTranslationStream(
  systemInstruction: string,
  userPrompt: string
): Promise<ReadableStream<string>> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction,
  });

  const result = await model.generateContentStream(userPrompt);

  return new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(text);
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
