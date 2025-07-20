// web-v7/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      supabaseAccessToken?: string; // 添加这一行
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    supabaseAccessToken?: string; // 添加这一行
  }
}
