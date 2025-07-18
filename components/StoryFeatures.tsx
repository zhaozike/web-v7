import Image from "next/image";

const StoryFeatures = () => {
  const features = [
    {
      icon: "🎨",
      title: "AI智能创作",
      description: "只需输入几个关键词，AI就能为你创造出精彩的故事情节和美丽的插画",
      image: "/images/illustrations/EoyWARbbV3UE.jpg",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: "📚",
      title: "个性化故事",
      description: "每个故事都是独一无二的，可以让孩子成为故事的主角",
      image: "/images/illustrations/875ZDDvaWE0W.jpg",
      color: "from-green-400 to-green-600"
    },
    {
      icon: "🎵",
      title: "有声阅读",
      description: "专业的配音让故事更加生动，培养孩子的听力和想象力",
      image: "/images/illustrations/KOXgu1EUeYFQ.jpg",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: "🌟",
      title: "互动体验",
      description: "点击式互动让阅读变得更有趣，提高孩子的参与度",
      image: "/images/illustrations/QR68SeDj4zN1.jpg",
      color: "from-pink-400 to-pink-600"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
      {/* 标题部分 */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-6">
          <span className="text-2xl">✨</span>
          <span className="text-orange-600 font-semibold">神奇功能</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
          让故事创作变得
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            简单有趣
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          我们的AI技术让每个孩子都能轻松创作出属于自己的精彩故事
        </p>
      </div>

      {/* 功能网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
          >
            {/* 图片部分 */}
            <div className="relative h-48 lg:h-56 overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              {/* 图标 */}
              <div className="absolute top-6 left-6">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
              </div>
            </div>

            {/* 内容部分 */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-500 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {feature.description}
              </p>
              
              {/* 装饰性进度条 */}
              <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部行动号召 */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
            准备好创作你的第一个故事了吗？
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            只需要几分钟，就能拥有一个完全属于你的精彩故事
          </p>
          <button className="btn bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none px-10 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            🚀 立即开始创作
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoryFeatures;

