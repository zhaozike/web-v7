// web-v7/app/create-story/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { supabase } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";

import ChildrenNavbar from "@/components/ChildrenNavbar";
import ChildrenFooter from "@/components/ChildrenFooter";

function CreateStorybookContent() {
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState(""); // 新增标签输入
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStorybook, setGeneratedStorybook] = useState<string | null>(null); // 存储生成的绘本内容
  const [error, setError] = useState<string | null>(null);
  const [supabaseJwt, setSupabaseJwt] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSupabaseJwt(session.access_token);
      } else {
        setSupabaseJwt(null);
        router.push("/auth/signin"); // 如果未登录，重定向到登录页面
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSupabaseJwt(session.access_token);
      } else {
        router.push("/auth/signin");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleCreateStorybook = async () => {
    if (!prompt.trim()) {
      setError("请输入绘本主题。");
      return;
    }

    if (!supabaseJwt) {
      setError("请先登录以创作绘本。");
      router.push("/auth/signin");
      return;
    }

    setIsGenerating(true);
    setGeneratedStorybook(null);
    setError(null);

    try {
      const response = await fetch("/api/suna", { // 调用现有 /api/suna 路由
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseJwt}`,
        },
        body: JSON.stringify({
          prompt,
          tags, // 传递标签
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "绘本生成失败。");
      }

      const data = await response.json();
      // 假设 /api/suna 现在返回任务 ID，需要轮询
      const { thread_id, agent_run_id } = data;

      let storybookResult = null;
      let status = "pending";
      const maxAttempts = 60; 
      let attempts = 0;

      while (status !== "completed" && status !== "failed" && attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000)); 

        const statusResponse = await fetch("/api/suna-status", { // 调用现有 /api/suna-status 路由
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseJwt}`,
          },
          body: JSON.stringify({ thread_id, agent_run_id }),
        });

        if (!statusResponse.ok) {
          throw new Error("查询绘本状态失败。");
        }

        const statusData = await statusResponse.json();
        status = statusData.status;
        storybookResult = statusData.story; // 假设状态 API 返回最终绘本内容

        if (status === "failed") {
          throw new Error(statusData.message || "绘本生成失败。");
        }
      }

      if (status === "completed" && storybookResult) {
        setGeneratedStorybook(storybookResult);
      } else if (attempts >= maxAttempts) {
        setError("绘本生成超时，请稍后再试。");
      } else {
        setError("绘本生成未完成或发生未知错误。");
      }

    } catch (err) {
      console.error("Error during storybook generation:", err);
      setError(err instanceof Error ? err.message : "绘本生成过程中发生未知错误。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ChildrenNavbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">创作你的专属绘本</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-gray-700 text-sm font-bold mb-2">
              绘本主题/关键词:
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例如：一只勇敢的小猫去太空探险"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
              标签 (可选，逗号分隔):
            </label>
            <input
              id="tags"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例如：儿童, 奇幻, 动物"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="button"
              onClick={handleCreateStorybook}
              disabled={isGenerating}
            >
              {isGenerating ? "正在生成..." : "生成绘本"}
            </button>
          </div>

          {isGenerating && (
            <div className="mt-4 text-center text-gray-600">
              <p>绘本正在生成中，请稍候...</p>
            </div>
          )}

          {generatedStorybook && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold mb-4">生成的绘本:</h2>
              <div className="whitespace-pre-wrap text-gray-800">
                {generatedStorybook}
              </div>
            </div>
          )}
        </div>
      </main>
      <ChildrenFooter />
    </div>
  );
}

export default function CreateStorybookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateStorybookContent />
    </Suspense>
  );
}
