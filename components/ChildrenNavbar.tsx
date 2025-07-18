import Link from "next/link";
import ButtonSignin from "./ButtonSignin";

const ChildrenNavbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <span className="text-white text-xl sm:text-2xl font-bold">📚</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  AI魔法绘本
                </span>
              </h1>
              <p className="text-xs text-gray-500 -mt-1">让想象力飞翔</p>
            </div>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/create-story" 
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 group"
            >
              <span className="text-lg group-hover:animate-bounce">🎨</span>
              创作故事
            </Link>
            <Link 
              href="/story-gallery" 
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 group"
            >
              <span className="text-lg group-hover:animate-bounce">📖</span>
              故事库
            </Link>
            <Link 
              href="/my-stories" 
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 group"
            >
              <span className="text-lg group-hover:animate-bounce">⭐</span>
              我的故事
            </Link>
            <Link 
              href="/help" 
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 group"
            >
              <span className="text-lg group-hover:animate-bounce">❓</span>
              帮助
            </Link>
          </nav>

          {/* 搜索和登录 */}
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="搜索故事..."
                className="w-48 lg:w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* 登录按钮 */}
            <ButtonSignin text="登录" />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端搜索栏 */}
      <div className="sm:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索故事..."
            className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChildrenNavbar;

