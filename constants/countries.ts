import { Country } from "@/types";

export const COUNTRIES: Country[] = [
  { code: "IN", name: "인도", englishName: "India" },
  { code: "US", name: "미국", englishName: "USA" },
  { code: "PH", name: "필리핀", englishName: "Philippines" },
  { code: "NG", name: "나이지리아", englishName: "Nigeria" },
  { code: "KE", name: "케냐", englishName: "Kenya" },
  { code: "GH", name: "가나", englishName: "Ghana" },
  { code: "EG", name: "이집트", englishName: "Egypt" },
  { code: "BR", name: "브라질", englishName: "Brazil" },
  { code: "MX", name: "멕시코", englishName: "Mexico" },
  { code: "ID", name: "인도네시아", englishName: "Indonesia" },
  { code: "MM", name: "미얀마", englishName: "Myanmar" },
  { code: "KH", name: "캄보디아", englishName: "Cambodia" },
  { code: "VN", name: "베트남", englishName: "Vietnam" },
  { code: "TH", name: "태국", englishName: "Thailand" },
  { code: "NP", name: "네팔", englishName: "Nepal" },
  { code: "BD", name: "방글라데시", englishName: "Bangladesh" },
  { code: "LK", name: "스리랑카", englishName: "Sri Lanka" },
  { code: "PK", name: "파키스탄", englishName: "Pakistan" },
];

export const COUNTRY_MAP: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c])
);

export const GENDER_OPTIONS = [
  { value: "male", label: "남성 (Brother)" },
  { value: "female", label: "여성 (Sister)" },
  { value: "unspecified", label: "미선택" },
];

export const DEFAULT_RECIPIENT_COUNTRY = "IN";
export const DEFAULT_RECIPIENT_GENDER = "unspecified";
