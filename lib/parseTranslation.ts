import { ParsedTranslation } from "@/types";

export function parseTranslation(raw: string): ParsedTranslation {
  const result: ParsedTranslation = {};
  const regex = /\[([\w\s\-]+)\]\s*\n([\s\S]*?)(?=\n\[[\w\s\-]+\]|$)/g;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    const langName = match[1].trim();
    const translatedText = match[2].trim();
    if (langName && translatedText) {
      result[langName] = translatedText;
    }
  }

  return result;
}
