"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import ChildrenNavbar from "@/components/ChildrenNavbar";
import ChildrenFooter from "@/components/ChildrenFooter";

function StoryGalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");

  const categories = [
    { id: "all", name: "全部", icon: "📚" },
    { id: "adventure", name: "冒险", icon: "🗺️" },
    { id: "friendship", name: "友谊", icon: "👫" },
    { id: "learning", name: "学习", icon: "🎓" },
    { id: "fantasy", name: "幻想", icon: "🦄" },
  ];

  const ageGroups = [
    { id: "all", name: "全部年龄" },
    { id: "3-5", name: "3-5岁" },
    { id: "6-8", name: "6-8岁" },
    { id: "9-12", name: "9-12岁" },
  ];

  const stories = [
    {
      id: 1,
      title: "小兔子的彩虹之旅",
      description: "一只可爱的小兔子发现了通往彩虹王国的秘密通道",
      image: "/images/illustrations/KOXgu1EUeYFQ.jpg",
      category: "adventure",
      age: "3-5",
      pages: 12,
      rating: 4.8,
      reads: 1234
    },
    {
      id: 2,
      title: "森林里的音乐会",
      description: "小动物们一起准备一场特别的森林音乐会",
      image: "/images/illustrations/QR68SeDj4zN1.jpg",
      category: "friendship",
      age: "6-8",
      pages: 16,
      rating: 4.9,
      reads: 2156
    },
    {
      id: 3,
      title: "会飞的小猫咪",
      description: "一只普通的小猫咪突然获得了飞行的魔法能力",
      image: "/images/illustrations/EoyWARbbV3UE.jpg",
      category: "fantasy",
      age: "6-8",
      pages: 20,
      rating: 4.7,
      reads: 1876
    },
    {
      id: 4,
      title: "数字王国的冒险",
      description: "在数字王国里学习数学的有趣冒险",
      image: "/images/illustrations/875ZDDvaWE0W.jpg",
      category: "learning",
      age: "9-12",
      pages: 24,
      rating: 4.6,
      reads: 987
    },
    {
      id: 5,
      title: "星星的秘密",
      description: "小女孩发现了星星背后的神奇秘密",
      image: "/images/illustrations/3F58XCeUCpOM.png",
      category: "fantasy",
      age: "3-5",
      pages: 14,
      rating: 4.8,
      reads: 1543
    },
    {
      id: 6,
      title: "勇敢的小船长",
      description: "年轻的船长带领船员们寻找传说中的宝藏",
      image: "/images/illustrations/Zi06eGpAE99c.jpg",
      category: "adventure",
      age: "9-12",
      pages: 28,
      rating: 4.9,
      reads: 2341
    }
  ];

  const filteredStories = stories.filter(story => {
    const categoryMatch = selectedCategory === "all" || story.category === selectedCategory;
    const ageMatch = selectedAge === "all" || story.age === selectedAge;
    return categoryMatch && ageMatch;
  });

  return (
    <>
      <ChildrenNavbar />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">📖</span>
              <span className="text-green-600 font-semibold">故事库</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              发现精彩的
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                故事世界
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              浏览我们精心收集的故事，每一个都充满想象力和教育意义
            </p>
          </div>

          {/* 筛选器 */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* 分类筛选 */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🏷️</span>
                  故事分类
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 年龄筛选 */}
              <div className="lg:w-64">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">👶</span>
                  适合年龄
                </h3>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                >
                  {ageGroups.map((age) => (
                    <option key={age.id} value={age.id}>
                      {age.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 故事网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              >
                {/* 故事封面 */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* 年龄标签 */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                    {story.age}岁
                  </div>
                  
                  {/* 页数标签 */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {story.pages}页
                  </div>
                </div>

                {/* 故事信息 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-500 transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {story.description}
                  </p>
                  
                  {/* 评分和阅读数 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400 text-sm">
                        ⭐⭐⭐⭐⭐
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{story.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>👁️</span>
                      <span>{story.reads.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <button className="flex-1 btn bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-none rounded-full">
                      📖 开始阅读
                    </button>
                    <button className="btn btn-outline border-2 border-gray-300 text-gray-600 hover:bg-gray-500 hover:text-white rounded-full px-4">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 加载更多 */}
          <div className="text-center mt-12">
            <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              📚 加载更多故事
            </button>
          </div>
        </div>
      </main>
      <ChildrenFooter />
    </>
  );
}

export default function StoryGalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    }>
      <StoryGalleryContent />
    </Suspense>
  );
}

