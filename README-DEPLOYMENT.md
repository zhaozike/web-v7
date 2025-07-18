# GitHub Actions 部署指南

此文档介绍如何使用 GitHub Actions 工作流自动构建和部署 Next.js 应用到服务器。

## 工作流程说明

工作流 `.github/workflows/deploy.yml` 会在以下情况触发：
- 当代码推送到 `main` 分支时（默认部署到生产环境）
- 手动触发工作流时（可选择部署环境：production 或 test）

工作流程会：
1. 检出代码仓库
2. 设置 Node.js 环境
3. 安装项目依赖
4. 构建 Next.js 应用（包含以下步骤）：
   - 使用特定环境变量构建应用
   - 生成站点地图
   - 复制必要文件到 standalone 目录
   - 复制环境配置文件
5. 使用 rsync 将构建文件部署到服务器
6. 使用 PM2 重启应用（应用名称为 `website`）

## 环境配置

工作流支持两种部署环境：
- `production`：生产环境
- `test`：测试环境

手动触发工作流时，可以在 GitHub 界面选择目标环境。

## 必要文件

确保仓库中包含以下文件：
- `pm2.config.js`：PM2 配置文件

## 设置 GitHub Secrets

需要在 GitHub 仓库中添加以下 Secrets：

1. `SSH_PRIVATE_KEY`：用于连接服务器的 SSH 私钥
2. `SSH_KNOWN_HOSTS`：服务器的 SSH 指纹（可通过 `ssh-keyscan 服务器IP或域名` 获得）
3. `SSH_HOST`：服务器的 IP 地址或域名
4. `SSH_USERNAME`：服务器的用户名（如 `ubuntu`）
5. `SSH_DEPLOY_PATH`：服务器上应用的部署路径（如 `/home/ubuntu/wwwroot/site/`）
6. `SSH_PORT`：(可选) SSH 端口，默认为 22

### 添加 Secrets 步骤

1. 在 GitHub 仓库页面，点击 "Settings"
2. 在左侧导航中，点击 "Secrets and variables" > "Actions"
3. 点击 "New repository secret"，添加上述各项 Secret

## 服务器准备

确保服务器上已安装：

1. Node.js (建议版本 18 或更高)
2. npm
3. PM2 (`npm install -g pm2`) - 用于进程管理
4. rsync - 用于文件传输

## 手动触发部署

1. 进入仓库的 "Actions" 标签页
2. 选择 "Build and Deploy" 工作流
3. 点击 "Run workflow"
4. 选择目标分支和部署环境
5. 点击 "Run workflow" 按钮启动部署

## 注意事项

- 确保服务器上的用户对部署目录有足够的写入权限
- PM2 配置中的应用名称为 `website`，请勿修改
- 首次部署前，需要手动将所有环境文件和证书文件加入仓库
- 如果使用自定义域名，请确保已正确配置 DNS 和 Web 服务器（如 Nginx） 