"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { COUNTRIES, GENDER_OPTIONS } from "@/constants/countries";

interface RecipientSelectorProps {
  country: string;
  gender: string;
  onCountryChange: (value: string) => void;
  onGenderChange: (value: string) => void;
}

export default function RecipientSelector({
  country,
  gender,
  onCountryChange,
  onGenderChange,
}: RecipientSelectorProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex flex-col gap-1.5 flex-1">
        <Label htmlFor="country-select" className="text-sm font-medium">
          대상자 국가
        </Label>
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger id="country-select">
            <SelectValue placeholder="국가 선택" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name} ({c.englishName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <Label htmlFor="gender-select" className="text-sm font-medium">
          대상자 성별
        </Label>
        <Select value={gender} onValueChange={onGenderChange}>
          <SelectTrigger id="gender-select">
            <SelectValue placeholder="성별 선택" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
