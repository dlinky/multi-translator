import { readFile } from "fs/promises";
import path from "path";

interface SystemPromptParams {
  targetCountry: string;
  recipientGender: string;
}

export interface TranslatePromptParams {
  inputLangName: string;
  inputLangEnglishName: string;
  outputLangNames: string;
  outputLangEnglishNames: string[];
  text: string;
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

async function readPromptFile(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "prompts", filename);
  return readFile(filePath, "utf-8");
}

export async function buildSystemPrompt({ targetCountry, recipientGender }: SystemPromptParams): Promise<string> {
  const genderNote =
    recipientGender === "male"
      ? 'Use "Brother" as the standard greeting.'
      : recipientGender === "female"
      ? 'Use "Sister" as the standard greeting.'
      : "Keep a neutral, respectful tone without gender-specific greetings.";

  const template = await readPromptFile("system.txt");
  return fill(template, { targetCountry, genderNote });
}

export async function buildTranslatePrompt({
  inputLangName,
  inputLangEnglishName,
  outputLangNames,
  outputLangEnglishNames,
  text,
}: TranslatePromptParams): Promise<string> {
  const tagList = outputLangEnglishNames.map((n) => `[${n}]`).join(", ");
  const exampleOutput = outputLangEnglishNames
    .map((n) => `[${n}]\n(번역된 ${n} 텍스트)`)
    .join("\n\n");

  const template = await readPromptFile("translate.txt");
  return fill(template, {
    inputLangName,
    inputLangEnglishName,
    outputLangNames,
    tagList,
    exampleOutput,
    text,
  });
}
