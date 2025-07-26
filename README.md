# HRU

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

HRU 是一个关注用户健康与安全的守护类应用，灵感源自"死了么 APP"一条评论。

## 🌟 项目简介

- **健康打卡**：用户可每日一键打卡，记录自己的健康状态，系统会自动保存打卡时间。
- **紧急联系人**：支持设置亲友为紧急联系人，关键时刻自动通知，守护你的安全。
- **智能提醒**：若用户连续多天未打卡，系统会自动通过邮件提醒紧急联系人，防止意外被忽视。
- **免登录体验**：支持匿名注册和免登录使用，降低使用门槛，保护隐私。
- **极简设计**：界面简洁温暖，操作直观，适合所有年龄段用户。
- **数据安全**：采用现代 Web 技术与安全机制，保障用户数据隐私。

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 数据库
- 邮件服务（如 Gmail SMTP）

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/chenxiaofie/hru.git
   cd hru
   ```

2. **安装依赖**

   ```bash
   npm install
   # 或者
   pnpm install
   ```

3. **配置环境变量**

   ```bash
   cp env.example .env.local
   ```

   然后编辑 `.env.local` 文件，填写必要的配置信息。

4. **数据库设置**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **启动开发服务器**

   ```bash
   npm run dev
   # 或者
   pnpm dev
   ```

6. **访问应用**
   在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📋 功能特性

- ✅ 用户健康打卡
- ✅ 紧急联系人管理
- ✅ 自动邮件通知
- ✅ 匿名注册登录
- ✅ 响应式设计
- ✅ 数据安全保护

## 🛠️ 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **UI**: Material-UI, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **邮件**: Nodemailer
- **部署**: Vercel

## 📝 环境变量

请参考 `env.example` 文件配置以下环境变量：

- `DATABASE_URL`: PostgreSQL 数据库连接字符串
- `NEXTAUTH_SECRET`: NextAuth 密钥
- `EMAIL_SERVER_*`: 邮件服务器配置
- `JWT_SECRET`: JWT 签名密钥
- `CRON_SECRET`: 定时任务密钥（可选，用于额外的安全验证）

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！
