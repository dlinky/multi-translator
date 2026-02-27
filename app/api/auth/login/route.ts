import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { LoginRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { user_id } = body;

    if (!user_id || user_id.trim().length === 0) {
      return NextResponse.json({ error: "아이디를 입력해주세요." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("multi_translator_account")
      .select("user_id")
      .eq("user_id", user_id.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "등록되지 않은 아이디입니다." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[login] error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
