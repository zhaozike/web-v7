import Link from "next/link";

const ChildrenFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 品牌信息 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">📚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                    AI魔法绘本
                  </span>
                </h3>
                <p className="text-sm text-gray-500">让想象力飞翔</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
              我们致力于为孩子们创造一个充满想象力和创造力的数字阅读世界。
              通过AI技术，让每个孩子都能成为故事的主角。
            </p>
            
            {/* 社交媒体链接 */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <span className="text-lg">📧</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <span className="text-lg">📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                <span className="text-lg">🌐</span>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              快速链接
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/create-story" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">🎨</span>
                  创作故事
                </Link>
              </li>
              <li>
                <Link href="/story-gallery" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">📖</span>
                  故事库
                </Link>
              </li>
              <li>
                <Link href="/my-stories" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">⭐</span>
                  我的故事
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">👤</span>
                  个人中心
                </Link>
              </li>
            </ul>
          </div>

          {/* 帮助支持 */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">❓</span>
              帮助支持
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">📋</span>
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">📞</span>
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">📖</span>
                  使用指南
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="group-hover:animate-bounce">🛡️</span>
                  安全保护
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-orange-200 my-12"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              © 2024 AI魔法绘本. 保留所有权利.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              为孩子们创造更美好的阅读体验
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
              服务条款
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
              Cookie政策
            </Link>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-10 transform translate-x-16 translate-y-16"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20"></div>
      </div>
    </footer>
  );
};

export default ChildrenFooter;

