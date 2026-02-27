import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { RegisterRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { user_id } = body;

    if (!user_id || user_id.trim().length === 0) {
      return NextResponse.json({ error: "아이디를 입력해주세요." }, { status: 400 });
    }

    if (user_id.length > 50) {
      return NextResponse.json({ error: "아이디는 50자 이하여야 합니다." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("multi_translator_account")
      .insert({ user_id: user_id.trim() });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "이미 사용중인 아이디입니다." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[register] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
