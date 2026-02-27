# 해섬 번역기 v1.0

Gemini 2.5 Flash 기반 웹 다국어 번역기. 크리스천 청·장년 학생 대상 자연스러운 번역에 최적화.

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 데이터베이스 | Supabase (PostgreSQL) |
| AI | Gemini 2.5 Flash (스트리밍) |
| 배포 | Vercel |

## 주요 기능

- 8개 언어 동시 번역 (한국어, 영어, 텔루구어, 힌디어, 일본어, 중국어 간체, 칸나다어, 벵골어)
- 번역 대상자 설정 (국가 18개, 성별) → 프롬프트에 자동 반영
- 번역 설정 저장/불러오기 (계정별)
- 스트리밍 번역 (결과 즉시 표시)
- 언어별 개별 복사 / 전체 복사
- 아이디 기반 간편 로그인 (비밀번호 없음)

## 프로젝트 구조

```
├── app/
│   ├── page.tsx                  # 번역 메인
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── api/
│       ├── auth/register/route.ts
│       ├── auth/login/route.ts
│       ├── settings/route.ts
│       └── translate/route.ts
├── components/                   # UI 컴포넌트
├── lib/
│   ├── gemini.ts                 # Gemini API 스트리밍
│   ├── prompts.ts                # 프롬프트 빌더 (txt 파일 읽기)
│   ├── parseTranslation.ts       # 응답 파싱
│   └── supabase/server.ts
├── prompts/
│   ├── system.txt                # 시스템 프롬프트 (직접 편집 가능)
│   └── translate.txt             # 번역 프롬프트 (직접 편집 가능)
├── constants/
│   ├── languages.ts
│   └── countries.ts
└── types/index.ts
```

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 루트에 생성하고 아래 값을 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxx...
GEMINI_API_KEY=AIzaxxxxxxxx...
```

### 3. Supabase 테이블 생성

Supabase SQL Editor에서 실행:

```sql
CREATE TABLE multi_translator_account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE multi_translator_account_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID UNIQUE NOT NULL REFERENCES multi_translator_account(id) ON DELETE CASCADE,
  recipient_country VARCHAR(50),
  recipient_gender VARCHAR(20),
  output_langs TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE multi_translator_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES multi_translator_account(id) ON DELETE SET NULL,
  input_text TEXT NOT NULL,
  gemini_raw_response TEXT NOT NULL,
  parsed_results JSONB,
  input_lang VARCHAR(20),
  output_langs TEXT[],
  recipient_country VARCHAR(50),
  recipient_gender VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

## Vercel 배포

1. [vercel.com](https://vercel.com) → Import Git Repository
2. **Environment Variables** 탭에 `.env.local`의 4개 변수 동일하게 등록
3. Deploy

> `prompts/system.txt`, `prompts/translate.txt`는 코드 수정 없이 직접 편집 가능합니다.  
> `{{변수명}}` 플레이스홀더는 런타임에 자동 치환됩니다.

## 프롬프트 수정

프롬프트는 코드와 분리된 텍스트 파일로 관리됩니다.

| 파일 | 역할 | 사용 변수 |
|------|------|-----------|
| `prompts/system.txt` | AI 페르소나·스타일 정의 | `{{targetCountry}}`, `{{genderNote}}` |
| `prompts/translate.txt` | 번역 지시 | `{{inputLangName}}`, `{{inputLangEnglishName}}`, `{{outputLangNames}}`, `{{tagList}}`, `{{exampleOutput}}`, `{{text}}` |

## 국가 목록 수정

번역 대상자 국가 드롭다운 목록은 아래 파일에서 관리합니다.

**수정 파일**: `constants/countries.ts`

```ts
export const COUNTRIES: Country[] = [
  { code: "INTL", name: "전세계", englishName: "International" },
  { code: "KR",   name: "한국",   englishName: "South Korea" },
  // 추가할 국가를 여기에 입력
  // { code: "국가코드", name: "한국어명", englishName: "영문명" },
];

// 기본 선택값 변경 시 code 값을 수정
export const DEFAULT_RECIPIENT_COUNTRY = "INTL";
```

- `code`: 내부 식별자 (자유롭게 지정, 중복 없으면 됨)
- `name`: UI에 표시되는 한국어 이름
- `englishName`: AI 프롬프트에 전달되는 영문 이름 → 번역 문체에 영향

## 지원 언어 목록 수정

번역 입력/출력 언어 목록은 아래 파일에서 관리합니다.

**수정 파일**: `constants/languages.ts`

```ts
export const LANGUAGES: Language[] = [
  { code: "ko", name: "한국어", englishName: "Korean" },
  // 추가할 언어를 여기에 입력
];
```
