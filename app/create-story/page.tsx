"use client";

import { useState, useEffect, Suspense } from 'react';
import { getSession } from '@/libs/supabaseAuth';
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
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  const handleCreateStory = async () => {
    if (!prompt.trim()) return;
    if (!session) {
      setError("请先登录后再创作故事");
      return;
    }

    setIsGenerating(true);
    setGeneratedStory(null);
    setError("");

    try {
      const startResponse = await fetch("/api/suna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          storyLength,
          ageGroup,
          storyType,
        }),
      });

      const startData = await startResponse.json();

      if (!startResponse.ok) {
        throw new Error(startData.error || "启动Suna Agent失败");
      }

      const { threadId, agentRunId } = startData;

      // 开始轮询Suna Agent状态
      let status = "running";
      let storyResult = null;
      while (status === "running") {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 每3秒轮询一次

        const statusResponse = await fetch(`/api/suna-status?threadId=${threadId}&agentRunId=${agentRunId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const statusData = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(statusData.error || "获取Suna Agent状态失败");
        }

        status = statusData.status;
        if (status === "completed") {
          storyResult = statusData.story;
          break;
        } else if (status === "failed") {
          throw new Error(statusData.error || "Suna Agent运行失败");
        }
      }

      if (storyResult) {
        setGeneratedStory(storyResult);
      } else {
        throw new Error("未收到有效的故事数据");
      }
    } catch (err: any) {
      console.error("Story generation error:", err);
      setError(err.message || "生成故事时发生错误，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <ChildrenNavbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">🎨</span>
              <span className="text-blue-600 font-semibold">AI故事创作</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              创造你的
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                专属故事
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              告诉我们你想要什么样的故事，AI会为你创造一个独一无二的绘本
            </p>
          </div>

          {/* 创作表单 */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12">
            <div className="space-y-8">
              {/* 提示词输入 */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  描述你想要的故事
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只会飞的小猫咪在彩虹上的冒险..."
                  className="w-full h-32 p-6 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none resize-none text-lg"
                  disabled={isGenerating}
                />
              </div>

              {/* 故事设置 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">故事长度</label>
                  <select 
                    value={storyLength}
                    onChange={(e) => setStoryLength(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                    disabled={isGenerating}
                  >
                    <option value="short">短故事 (5-8页)</option>
                    <option value="medium">中等故事 (10-15页)</option>
                    <option value="long">长故事 (20-25页)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">适合年龄</label>
                  <select 
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                    disabled={isGenerating}
                  >
                    <option value="3-5">3-5岁</option>
                    <option value="6-8">6-8岁</option>
                    <option value="9-12">9-12岁</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">故事类型</label>
                  <select 
                    value={storyType}
                    onChange={(e) => setStoryType(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                    disabled={isGenerating}
                  >
                    <option value="adventure">冒险故事</option>
                    <option value="friendship">友谊故事</option>
                    <option value="learning">学习故事</option>
                    <option value="fantasy">幻想故事</option>
                  </select>
                </div>
              </div>

              {/* 创作按钮 */}
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

          {/* 错误显示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">生成失败</h3>
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() => setError("")}
                    className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 生成进度 */}
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
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">正在生成精美的插画和有趣的情节...</p>
              </div>
            </div>
          )}

          {/* 生成结果 */}
          {generatedStory && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">🎉 你的故事创作完成了！</h3>
                <p className="text-gray-600">你的专属绘本故事已经生成完成</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                {/* 故事标题 */}
                {generatedStory.title && (
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {generatedStory.title}
                  </h4>
                )}
                
                {/* 故事内容预览 */}
                {generatedStory.content && (
                  <div className="mb-6">
                    <p className="text-gray-600 text-center mb-4">
                      {typeof generatedStory.content === 'string' 
                        ? generatedStory.content.substring(0, 200) + (generatedStory.content.length > 200 ? '...' : '')
                        : '故事内容已生成完成'
                      }
                    </p>
                  </div>
                )}
                
                {/* 故事页面 */}
                {generatedStory.pages && Array.isArray(generatedStory.pages) && (
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-700 mb-3">故事包含 {generatedStory.pages.length} 页</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedStory.pages.slice(0, 6).map((page: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="text-sm text-gray-500 mb-2">第 {index + 1} 页</div>
                          {page.image && (
                            <img 
                              src={page.image} 
                              alt={`第${index + 1}页插图`}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                          )}
                          <p className="text-xs text-gray-600 line-clamp-3">
                            {page.text || page.content || '页面内容'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      // 这里可以添加查看完整故事的逻辑
                      console.log('查看完整故事:', generatedStory);
                    }}
                    className="btn bg-gradient-to-r from-green-500 to-blue-500 text-white border-none px-8 py-3 rounded-full"
                  >
                    📖 查看完整故事
                  </button>
                  <button 
                    onClick={() => {
                      // 这里可以添加保存故事的逻辑
                      console.log('保存故事:', generatedStory);
                    }}
                    className="btn btn-outline border-2 border-blue-300 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full"
                  >
                    💾 保存故事
                  </button>
                  <button 
                    onClick={() => {
                      setGeneratedStory(null);
                      setPrompt("");
                      setError("");
                    }}
                    className="btn btn-outline border-2 border-purple-300 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full"
                  >
                    🔄 重新创作
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <ChildrenFooter />
    </>
  );
}

export default function CreateStoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    }>
      <CreateStoryContent />
    </Suspense>
  );
}


