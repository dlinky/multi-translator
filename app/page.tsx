"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import RecipientSelector from "@/components/RecipientSelector";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationInput from "@/components/TranslationInput";
import TranslationResultCard from "@/components/TranslationResultCard";
import CopyAllButton from "@/components/CopyAllButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ParsedTranslation } from "@/types";
import { DEFAULT_INPUT_LANG, DEFAULT_OUTPUT_LANGS } from "@/constants/languages";
import { DEFAULT_RECIPIENT_COUNTRY, DEFAULT_RECIPIENT_GENDER } from "@/constants/countries";
import { Save, Settings } from "lucide-react";

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [inputLang, setInputLang] = useState(DEFAULT_INPUT_LANG);
  const [outputLangs, setOutputLangs] = useState<string[]>(DEFAULT_OUTPUT_LANGS);
  const [recipientCountry, setRecipientCountry] = useState(DEFAULT_RECIPIENT_COUNTRY);
  const [recipientGender, setRecipientGender] = useState(DEFAULT_RECIPIENT_GENDER);
  const [parsed, setParsed] = useState<ParsedTranslation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUserId(stored);
  }, [router]);

  const loadSettings = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`/api/settings?user_id=${encodeURIComponent(uid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.recipient_country) setRecipientCountry(data.recipient_country);
        if (data.recipient_gender) setRecipientGender(data.recipient_gender);
        if (data.output_langs && data.output_langs.length > 0) setOutputLangs(data.output_langs);
      }
    } catch {
      // 설정 로드 실패는 조용히 무시 (기본값 유지)
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadSettings(userId);
    }
  }, [userId, loadSettings]);

  async function handleSaveSettings() {
    if (!userId) return;

    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          recipient_country: recipientCountry,
          recipient_gender: recipientGender,
          output_langs: outputLangs,
        }),
      });

      if (res.ok) {
        toast({ description: "설정이 저장되었습니다." });
      } else {
        toast({ description: "설정 저장에 실패했습니다.", variant: "destructive" });
      }
    } catch {
      toast({ description: "네트워크 오류가 발생했습니다.", variant: "destructive" });
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function handleTranslate() {
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!inputText.trim()) return;

    setIsTranslating(true);
    setParsed(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          text: inputText,
          input_lang: inputLang,
          output_langs: outputLangs,
          recipient_country: recipientCountry,
          recipient_gender: recipientGender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ description: data.error ?? "번역에 실패했습니다.", variant: "destructive" });
        return;
      }

      setParsed(data.parsed);
    } catch {
      toast({ description: "네트워크 오류가 발생했습니다.", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  }

  if (!userId) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header userId={userId} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* 설정 패널 */}
        <section className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              번역 설정
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <RecipientSelector
              country={recipientCountry}
              gender={recipientGender}
              onCountryChange={setRecipientCountry}
              onGenderChange={setRecipientGender}
            />
            <LanguageSelector
              inputLang={inputLang}
              outputLangs={outputLangs}
              onInputLangChange={setInputLang}
              onOutputLangsChange={setOutputLangs}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSavingSettings || !settingsLoaded}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSavingSettings ? "저장 중..." : "설정 저장"}
              </Button>
            </div>
          </div>
        </section>

        {/* 번역 레이아웃: 모바일 - 단일 컬럼 / PC - 2컬럼 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 입력 */}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              원문 입력
            </h2>
            <TranslationInput
              value={inputText}
              onChange={setInputText}
              onTranslate={handleTranslate}
              isLoading={isTranslating}
            />
          </section>

          {/* 결과 */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                번역 결과
              </h2>
              {parsed && Object.keys(parsed).length > 0 && (
                <CopyAllButton parsed={parsed} />
              )}
            </div>

            {parsed && Object.keys(parsed).length > 0 ? (
              <div className="flex flex-col gap-3">
                {Object.entries(parsed).map(([langName, text]) => (
                  <TranslationResultCard key={langName} langName={langName} text={text} />
                ))}
              </div>
            ) : (
              <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                {isTranslating ? "번역 중..." : "번역 결과가 여기에 표시됩니다."}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
