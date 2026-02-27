"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ParsedTranslation } from "@/types";

interface CopyAllButtonProps {
  parsed: ParsedTranslation;
}

export default function CopyAllButton({ parsed }: CopyAllButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyAll() {
    const text = Object.entries(parsed)
      .map(([lang, content]) => `[${lang}]\n${content}`)
      .join("\n\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" onClick={handleCopyAll} className="gap-2">
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          복사됨!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          전체 복사
        </>
      )}
    </Button>
  );
}
