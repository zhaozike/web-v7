import Link from "next/link";

const FAQ = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16 lg:py-24" id="faq">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <div className="inline-flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full mb-6 w-fit">
            <span className="text-2xl">❓</span>
            <span className="text-yellow-600 font-semibold">常见问题</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            家长们最关心的
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              问题解答
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            我们整理了家长和孩子们最常问的问题，希望能帮助您更好地了解我们的服务。
          </p>
        </div>

        <div className="basis-1/2 space-y-4">
          <div className="collapse collapse-plus bg-white shadow-lg rounded-2xl">
            <input type="radio" name="my-accordion-3" defaultChecked />
            <div className="collapse-title text-xl font-semibold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              AI是如何创作故事的？
            </div>
            <div className="collapse-content">
              <p className="text-gray-600 leading-relaxed">
                我们的AI会根据您输入的关键词和设置，智能生成符合儿童认知水平的故事情节，
                并配上精美的插画。每个故事都是独一无二的，专门为您的孩子量身定制。
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-white shadow-lg rounded-2xl">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-semibold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              内容安全吗？适合孩子阅读吗？
            </div>
            <div className="collapse-content">
              <p className="text-gray-600 leading-relaxed">
                绝对安全！我们的AI经过专门训练，只会生成积极正面、适合儿童的内容。
                所有故事都经过安全过滤，确保没有不当内容，让家长放心。
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-white shadow-lg rounded-2xl">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-semibold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">💰</span>
              使用需要付费吗？
            </div>
            <div className="collapse-content">
              <p className="text-gray-600 leading-relaxed">
                我们提供免费试用，让您和孩子先体验我们的服务。
                如需创作更多故事或使用高级功能，可以选择我们的订阅计划。
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-white shadow-lg rounded-2xl">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-semibold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">📱</span>
              可以在手机上使用吗？
            </div>
            <div className="collapse-content">
              <p className="text-gray-600 leading-relaxed">
                当然可以！我们的网站完全适配手机、平板和电脑，
                无论在哪里都能为孩子创作和阅读故事。
              </p>
            </div>
          </div>

          <div className="collapse collapse-plus bg-white shadow-lg rounded-2xl">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-semibold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">📞</span>
              还有其他问题怎么办？
            </div>
            <div className="collapse-content">
              <p className="text-gray-600 leading-relaxed">
                如果您还有其他问题，欢迎通过邮件或在线客服联系我们。
                我们的团队会尽快为您解答，确保您和孩子有最好的体验。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

