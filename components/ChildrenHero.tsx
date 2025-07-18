import Image from "next/image";
import Link from "next/link";

const ChildrenHero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20 rounded-3xl my-8">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        {/* 欢迎标语 */}
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <span className="text-sm font-medium text-gray-700">让每个孩子都成为故事的主角</span>
        </div>

        {/* 主标题 */}
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight text-gray-800 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            AI魔法绘本
          </span>
          <br />
          <span className="text-gray-700">创造属于你的故事</span>
        </h1>

        {/* 描述文字 */}
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
          只需要简单的几个词，AI就能为你创造出独一无二的绘本故事。
          让想象力插上翅膀，在这里每个孩子都是故事的主人公！
        </p>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/create-story" 
            className="btn bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            🎨 开始创作故事
          </Link>
          <Link 
            href="/story-gallery" 
            className="btn btn-outline border-2 border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
          >
            📚 浏览故事库
          </Link>
        </div>

        {/* 用户反馈 */}
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
              小
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
              明
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold">
              丽
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex text-yellow-400 text-sm">
              ⭐⭐⭐⭐⭐
            </div>
            <span className="text-sm text-gray-600 font-medium">已有1000+小朋友创作了属于自己的故事</span>
          </div>
        </div>
      </div>

      {/* 右侧插画 */}
      <div className="lg:w-full relative">
        <div className="relative w-full max-w-lg mx-auto">
          {/* 主要插画 */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/images/illustrations/3F58XCeUCpOM.png"
              alt="快乐的小朋友在阅读"
              className="w-full h-auto rounded-2xl"
              width={400}
              height={300}
              priority
            />
            {/* 装饰元素 */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
              🌟
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
              💝
            </div>
          </div>

          {/* 浮动装饰 */}
          <div className="absolute top-10 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-float"></div>
          <div className="absolute bottom-20 -right-8 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 animate-float-delayed"></div>
          <div className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-30 animate-float-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default ChildrenHero;

