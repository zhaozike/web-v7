
// web-v7/libs/next-auth.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter"; // 移除 MongoDBAdapter 导入
import config from "@/config";
// import connectMongo from "./mongo"; // 移除 connectMongo 导入

// 新增导入 SupabaseAdapter 和 supabase 客户端
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { supabase } from "@/utils/supabase/client"; 

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter?: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // 添加简单的邮箱密码登录
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email", placeholder: "请输入邮箱" },
        password: { label: "密码", type: "password", placeholder: "请输入密码" }
      },
      async authorize(credentials) {
        // 这里应该验证用户凭据
        // 为了演示，我们暂时允许任何邮箱和密码
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: credentials.email.split("@")[0],
            email: credentials.email,
          }
        }
        return null
      }
    }),
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    // ...(connectMongo // 移除 connectMongo 相关判断
    //   ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: config.resend.fromNoReply,
          }),
    //     ]
    //   : []),
  ],
  // 替换为 SupabaseAdapter
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string, // 使用 service_role key
  }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        // 从 Supabase 获取 session，并添加 access_token 到 NextAuth session
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        if (supabaseSession) {
          session.user.supabaseAccessToken = supabaseSession.access_token;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 如果URL已经是完整的URL且在同一域名下，直接返回
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // 如果是相对路径，拼接baseUrl
      if (url.startsWith("/")) {
        return baseUrl + url;
      }
      // 默认重定向到创作页面
      return baseUrl + "/create-story";
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don\"t add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
  pages: {
    signIn: 
'/auth/signin',
  },
};

export default NextAuth(authOptions );;