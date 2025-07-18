# 儿童绘本网站前端开发文档

## 项目概述

这是一个基于 Next.js 的儿童绘本网站前端项目，旨在为孩子们提供一个阳光、简洁、用户友好、自然且充满吸引力的数字绘本体验。

## 核心设计理念

- **阳光活力**：使用明亮、温暖、活泼的色彩，营造积极、快乐的氛围
- **简洁直观**：界面设计直观，导航路径清晰，避免复杂动画或信息堆砌
- **用户友好**：考虑儿童用户，按钮和交互区域足够大，易于点击
- **自然流畅**：动画和过渡流畅自然，布局符合儿童认知习惯
- **充满吸引力**：融入有趣的插画元素、互动效果和奖励机制

## 技术栈

### 核心框架
- **Next.js 14.1.4** - React 全栈框架
- **React 18.2.0** - 前端UI库
- **TypeScript** - 类型安全的JavaScript

### 样式和UI
- **Tailwind CSS 3.4.3** - 实用优先的CSS框架
- **DaisyUI 4.10.1** - Tailwind CSS组件库
- **PostCSS** - CSS后处理器

### 认证和数据库
- **NextAuth.js 4.24.7** - 身份验证解决方案
- **MongoDB** - 数据库（通过Mongoose）
- **@auth/mongodb-adapter** - MongoDB适配器

### 其他重要依赖
- **Axios** - HTTP客户端
- **React Hot Toast** - 通知组件
- **Resend** - 邮件服务
- **Zod** - 数据验证

## 项目结构

```
children-storybook-website/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── blog/              # 博客相关页面（将被移除）
│   ├── dashboard/         # 用户仪表板
│   └── page.tsx           # 主页
├── components/            # 可复用组件
├── libs/                  # 工具库
├── models/                # 数据模型
├── public/                # 静态资源
├── types/                 # TypeScript类型定义
├── config.ts              # 配置文件
├── tailwind.config.js     # Tailwind配置
└── next.config.js         # Next.js配置
```

## 快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 环境变量配置
复制 `.env.example` 到 `.env.local` 并填入相应的环境变量：

```bash
cp .env.example .env.local
```

必需的环境变量：
- `NEXTAUTH_URL` - NextAuth URL（本地开发：http://localhost:3000）
- `NEXTAUTH_SECRET` - NextAuth密钥

可选的环境变量：
- `GOOGLE_ID` / `GOOGLE_SECRET` - Google OAuth
- `MONGODB_URI` - MongoDB连接字符串
- `RESEND_API_KEY` - 邮件服务API密钥

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

## 常用开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 生成站点地图（构建后自动执行）
npm run postbuild
```

## 部署配置

### Vercel部署
1. 确保移除 `next.config.js` 中的 `output: 'export'` 和 `distDir: 'out'`
2. 在Vercel项目设置中配置环境变量
3. 推送代码到GitHub仓库，Vercel将自动部署

### 环境变量管理
- 生产环境的敏感变量必须在Vercel项目设置中配置
- `NEXTAUTH_URL` 在Vercel上应设置为 `https://${VERCEL_URL}` 或生产域名

## 开发注意事项

### TypeScript严格模式
- 项目启用了TypeScript严格模式
- 所有外部数据必须有明确的类型定义
- 错误处理中的 `catch` 块需要进行类型检查

### 防御性编程
- 数据获取时必须处理加载状态、错误状态和空值
- 使用可选链 `?.` 和空值合并 `??` 操作符
- 客户端Hook（如 `useSearchParams`）需要包裹在 `<Suspense>` 中

### 响应式设计
- 确保所有组件在手机、平板、桌面设备上都能正常显示
- 使用Tailwind CSS的响应式类名

## 功能模块规划

### 已移除的模块
- 支付系统（Stripe/Creem相关）
- 博客功能

### 核心功能模块
1. **首页** - 欢迎页面和AI绘本创作入口
2. **用户认证** - 登录/注册/个人中心
3. **AI绘本创作** - 提示词输入和实时生成
4. **绘本阅读** - 沉浸式阅读体验
5. **内容分类** - 按年龄、系列筛选
6. **帮助支持** - FAQ和联系我们

## 设计资源

项目中使用的设计素材遵循儿童友好设计原则：
- 明亮温暖的色彩（黄色、橙色、浅蓝色、草绿色）
- 圆润可爱的无衬线字体
- 简洁直观的卡通化图标
- 符合风格的插画和图片

## 贡献指南

1. 遵循现有的代码风格和ESLint配置
2. 确保所有新功能都有适当的TypeScript类型
3. 测试新功能在不同设备上的表现
4. 提交前运行 `npm run lint` 检查代码质量

## 支持

如有问题，请查看：
1. 项目的GitHub Issues
2. Next.js官方文档
3. Tailwind CSS文档
4. DaisyUI组件文档

