"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

interface TranslationResultCardProps {
  langName: string;
  text: string;
}

export default function TranslationResultCard({ langName, text }: TranslationResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <Badge variant="outline" className="text-xs font-semibold">
          {langName}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
          aria-label={`${langName} 번역 복사`}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}
