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
      ? '수신자가 남성이므로 "Brother"를 기본 호칭으로 사용하세요.'
      : recipientGender === "female"
      ? '수신자가 여성이므로 "Sister"를 기본 호칭으로 사용하세요.'
      : "성별 정보가 없으므로 성별 특정 호칭 없이 중립적이고 존중하는 어조를 유지하세요.";

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
