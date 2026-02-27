"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { LANGUAGES } from "@/constants/languages";

interface LanguageSelectorProps {
  inputLang: string;
  outputLangs: string[];
  onInputLangChange: (value: string) => void;
  onOutputLangsChange: (value: string[]) => void;
}

export default function LanguageSelector({
  inputLang,
  outputLangs,
  onInputLangChange,
  onOutputLangsChange,
}: LanguageSelectorProps) {
  function toggleOutputLang(code: string) {
    if (outputLangs.includes(code)) {
      if (outputLangs.length > 1) {
        onOutputLangsChange(outputLangs.filter((l) => l !== code));
      }
    } else {
      onOutputLangsChange([...outputLangs, code]);
    }
  }

  function removeOutputLang(code: string) {
    if (outputLangs.length > 1) {
      onOutputLangsChange(outputLangs.filter((l) => l !== code));
    }
  }

  const availableOutputLangs = LANGUAGES.filter((l) => l.code !== inputLang);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-lang-select" className="text-sm font-medium">
          원문 언어
        </Label>
        <Select value={inputLang} onValueChange={onInputLangChange}>
          <SelectTrigger id="input-lang-select" className="w-full sm:w-48">
            <SelectValue placeholder="언어 선택" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">번역 언어 (다중 선택)</Label>
        <div className="flex flex-wrap gap-2">
          {availableOutputLangs.map((l) => {
            const isSelected = outputLangs.includes(l.code);
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleOutputLang(l.code)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {l.name}
              </button>
            );
          })}
        </div>

        {outputLangs.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {outputLangs.map((code) => {
              const lang = LANGUAGES.find((l) => l.code === code);
              return (
                <Badge key={code} variant="secondary" className="gap-1 pr-1">
                  {lang?.name ?? code}
                  <button
                    type="button"
                    onClick={() => removeOutputLang(code)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                    aria-label={`${lang?.name} 제거`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
