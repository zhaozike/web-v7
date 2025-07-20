"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import ChildrenNavbar from "@/components/ChildrenNavbar";
import ChildrenFooter from "@/components/ChildrenFooter";

function CreateStoryContent() {
  const [prompt, setPrompt] = useState("");
  const [storyLength, setStoryLength] = useState("short");
  const [ageGroup, setAgeGroup] = useState("3-5");
  const [storyType, setStoryType] = useState("adventure");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const { data: session, status } = useSession();

  const handleCreateStory = async () => {
    if (!prompt.trim()) return;
    if (status === "unauthenticated") {
      setError("请先登录后再创作故事");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const startResponse = await fetch("/api/suna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.email || 'demo'}`, // 使用email作为授权凭证
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          storyLength,
          ageGroup,
          storyType,
        }),
      });

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        throw new Error(errorData.error || "故事生成失败");
      }

      const { threadId, agentRunId } = await startResponse.json();

      let storyResult = null;
      while (isGenerating) { // <-- 这里是修改的地方
        await new Promise(resolve => setTimeout(resolve, 3000)); // 每3秒轮询一次

        const statusResponse = await fetch(`/api/suna-status?threadId=${threadId}&agentRunId=${agentRunId}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.email || 'demo'}`, // 使用email作为授权凭证
          },
        });
        const statusData = await statusResponse.json();

        if (statusData.status === "completed") {
          storyResult = statusData.story;
          break;
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "故事生成失败");
        }
      }

      setGeneratedStory(storyResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <ChildrenNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          AI魔法绘本
          <br />
          <span className="text-purple-600">创造属于你的故事</span>
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">故事创作</h2>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">故事主题/关键词</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 text-base"
                placeholder="例如：一只勇敢的小猫，探索神秘的森林"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">故事长度</span>
                </label>
                <select
                  className="select select-bordered w-full text-base"
                  value={storyLength}
                  onChange={(e) => setStoryLength(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="short">短篇 (约500字)</option>
                  <option value="medium">中篇 (约1000字)</option>
                  <option value="long">长篇 (约2000字)</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">适合年龄</span>
                </label>
                <select
                  className="select select-bordered w-full text-base"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="3-5">3-5岁</option>
                  <option value="6-8">6-8岁</option>
                  <option value="9-12">9-12岁</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">故事类型</span>
                </label>
                <select
                  className="select select-bordered w-full text-base"
                  value={storyType}
                  onChange={(e) => setStoryType(e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="adventure">冒险故事</option>
                  <option value="friendship">友谊故事</option>
                  <option value="learning">学习故事</option>
                  <option value="fantasy">幻想故事</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleCreateStory}
                disabled={!prompt.trim() || isGenerating}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <span className="loading loading-spinner loading-md mr-2"></span>
                    AI正在创作中...
                  </>
                ) : (
                  <>
                    ✨ 开始创作故事
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">生成失败</h3>
                <p className="text-red-600">{error}</p>
                <button onClick={() => setError("")} className="mt-3 text-sm text-red-500 hover:text-red-700 underline">关闭</button>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-4xl text-white animate-bounce">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI正在为你创作故事...</h3>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>创作进度</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-pulse" style={{ width: "75%" }}></div>
                </div>
              </div>
              <p className="text-gray-600 mt-4">正在生成精美的插画和有趣的情节...</p>
            </div>
          </div>
        )}

        {generatedStory && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 你的故事创作完成了！</h3>
              <p className="text-gray-600">你的专属绘本故事已经生成完成</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              {generatedStory.title && (
                <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">{generatedStory.title}</h4>
              )}
              {generatedStory.content && (
                <div className="mb-6">
                  <p className="text-gray-600 text-center mb-4">
                    {typeof generatedStory.content === 'string' ? generatedStory.content.substring(0, 200) + (generatedStory.content.length > 200 ? '...' : '') : '故事内容已生成完成'}
                  </p>
                </div>
              )}
              {generatedStory.pages && Array.isArray(generatedStory.pages) && (
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-gray-700 mb-3">故事包含 {generatedStory.pages.length} 页</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedStory.pages.slice(0, 6).map((page: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-sm text-gray-500 mb-2">第 {index + 1} 页</div>
                        {page.image && (
                          <img src={page.image} alt={`第${index + 1}页插图`} className="w-full h-24 object-cover rounded mb-2" />
                        )}
                        <p className="text-xs text-gray-600 line-clamp-3">{page.text || page.content || '页面内容'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => console.log("查看完整故事:", generatedStory)} className="btn bg-gradient-to-r from-green-500 to-blue-500 text-white border-none px-8 py-3 rounded-full">
                  📖 查看完整故事
                </button>
                <button onClick={() => console.log("保存故事:", generatedStory)} className="btn btn-outline border-2 border-blue-300 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full">
                  💾 保存故事
                </button>
                <button onClick={() => { setGeneratedStory(null); setPrompt(""); setError(""); }} className="btn btn-outline border-2 border-purple-300 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full">
                  🔄 重新创作
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ChildrenFooter />
    </div>
  );
}

export default function CreateStory() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg"></div></div>}>
      <CreateStoryContent />
    </Suspense>
  );
}
