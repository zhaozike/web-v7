// web-v7/utils/auth/verifySupabaseJwt.ts
import { jwtVerify, importJWK } from "jose";

interface SupabaseJwtPayload {
  aud: string;
  exp: number;
  sub: string;
  email?: string;
  // ... 其他 Supabase JWT 包含的字段
}

export async function verifySupabaseJwt(token: string): Promise<SupabaseJwtPayload | null> {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    console.error("SUPABASE_JWT_SECRET is not configured.");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"], 
      audience: "authenticated", 
      issuer: `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//" )[1].split(".")[0]}.supabase.co/auth/v1`, // 动态获取issuer
    });

    return payload as SupabaseJwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
