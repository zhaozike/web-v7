// web-v7/app/api/suna/route.ts
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
    const { prompt, tags } = body; // 接收prompt和tags

    const sunaResponse = await fetch("https://suna-1.learnwise.app/api/agent/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseJwt}`,
        // 如果 Suna AI Agent 还需要额外的 API Key ，请在此处添加
        // ...(process.env.SUNAAI_API_KEY && { "X-Suna-Api-Key": process.env.SUNAAI_API_KEY }),
      },
      body: JSON.stringify({ prompt, tags }), // 传递prompt和tags
    });

    if (!sunaResponse.ok) {
      const errorText = await sunaResponse.text();
      return NextResponse.json(
        { error: `Suna AI Agent API 错误: ${sunaResponse.statusText}. 详情: ${errorText}` },
        { status: sunaResponse.status }
      );
    }

    const data = await sunaResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("调用 Suna AI Agent 失败:", error);
    return NextResponse.json({ error: "调用 Suna AI Agent 服务失败。" }, { status: 500 });
  }
}
