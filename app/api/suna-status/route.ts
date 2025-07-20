// web-v7/app/api/suna-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseJwt } from "@/utils/auth/verifySupabaseJwt"; 

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const supabaseJwt = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!supabaseJwt) {
    return NextResponse.json({ error: "未提供认证令牌。" }, { status: 401 });
  }

  const decodedJwt = await verifySupabaseJwt(supabaseJwt);
  if (!decodedJwt) {
    return NextResponse.json({ error: "无效的认证令牌。" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { thread_id, agent_run_id } = body;

    const statusResponse = await fetch("https://suna-1.learnwise.app/api/agent/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseJwt}`,
      },
      body: JSON.stringify({ thread_id, agent_run_id } ),
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      return NextResponse.json(
        { error: `Suna AI Agent 状态查询错误: ${statusResponse.statusText}. 详情: ${errorText}` },
        { status: statusResponse.status }
      );
    }

    const data = await statusResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("查询 Suna AI Agent 状态失败:", error);
    return NextResponse.json({ error: "查询 Suna AI Agent 状态服务失败。" }, { status: 500 });
  }
}
