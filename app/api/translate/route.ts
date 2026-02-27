import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildSystemPrompt, buildTranslatePrompt } from "@/lib/prompts";
import { generateTranslation } from "@/lib/gemini";
import { parseTranslation } from "@/lib/parseTranslation";
import { TranslateRequest } from "@/types";
import { LANGUAGE_MAP, LANGUAGES } from "@/constants/languages";
import { COUNTRY_MAP, COUNTRIES } from "@/constants/countries";

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    const { user_id, text, input_lang, output_langs, recipient_country, recipient_gender } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "번역할 텍스트를 입력해주세요." }, { status: 400 });
    }

    if (text.length > 3000) {
      return NextResponse.json({ error: "텍스트는 3000자 이하여야 합니다." }, { status: 400 });
    }

    const validLangCodes = LANGUAGES.map((l) => l.code);
    if (!input_lang || !validLangCodes.includes(input_lang)) {
      return NextResponse.json({ error: "유효하지 않은 입력 언어입니다." }, { status: 400 });
    }

    if (!output_langs || output_langs.length === 0) {
      return NextResponse.json({ error: "출력 언어를 1개 이상 선택해주세요." }, { status: 400 });
    }

    const invalidOutputLangs = output_langs.filter((l) => !validLangCodes.includes(l));
    if (invalidOutputLangs.length > 0) {
      return NextResponse.json({ error: "유효하지 않은 출력 언어가 포함되어 있습니다." }, { status: 400 });
    }

    const validCountryCodes = COUNTRIES.map((c) => c.code);
    if (recipient_country && !validCountryCodes.includes(recipient_country)) {
      return NextResponse.json({ error: "유효하지 않은 국가입니다." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: account, error: accountError } = await supabase
      .from("multi_translator_account")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "등록되지 않은 아이디입니다." }, { status: 404 });
    }

    const targetCountry = COUNTRY_MAP[recipient_country]?.englishName ?? recipient_country ?? "India";
    const inputLangName = LANGUAGE_MAP[input_lang]?.name ?? input_lang;
    const outputLangNames = output_langs
      .map((code) => LANGUAGE_MAP[code]?.name ?? code)
      .join(", ");

    const systemInstruction = buildSystemPrompt({
      targetCountry,
      recipientGender: recipient_gender ?? "unspecified",
    });

    const userPrompt = buildTranslatePrompt({
      inputLangName,
      outputLangNames,
      text: text.trim(),
    });

    const raw = await generateTranslation(systemInstruction, userPrompt);
    const parsed = parseTranslation(raw);

    await supabase.from("multi_translator_data").insert({
      account_id: account.id,
      input_text: text.trim(),
      gemini_raw_response: raw,
      parsed_results: parsed,
      input_lang,
      output_langs,
      recipient_country: recipient_country ?? null,
      recipient_gender: recipient_gender ?? null,
    });

    return NextResponse.json({ parsed, raw });
  } catch (error) {
    console.error("[translate] error:", error);
    return NextResponse.json({ error: "번역 중 오류가 발생했습니다." }, { status: 500 });
  }
}
