# 贡献指南

感谢您对 HRU 项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告 Bug

如果您发现了 Bug，请：

1. 在 GitHub Issues 中搜索是否已经有人报告过
2. 如果没有，请创建一个新的 Issue
3. 详细描述问题，包括：
   - 操作系统和浏览器版本
   - 重现步骤
   - 期望行为和实际行为
   - 截图（如果适用）

### 提交功能请求

如果您有新功能的想法：

1. 在 GitHub Issues 中搜索是否已经有人提出过
2. 如果没有，请创建一个新的 Issue
3. 详细描述功能需求和使用场景

### 提交代码

1. Fork 这个仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 开发环境设置

1. 克隆仓库：

   ```bash
   git clone https://github.com/chenxiaofie/hru.git
   cd hru
   ```

2. 安装依赖：

   ```bash
   npm install
   # 或
   pnpm install
   ```

3. 设置环境变量：

   - 复制 `.env.example` 到 `.env.local`
   - 填写必要的环境变量

4. 运行开发服务器：
   ```bash
   npm run dev
   ```

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 提交信息使用中文或英文
- 保持代码简洁和可读性

## 许可证

通过提交 Pull Request，您同意您的贡献将在 MIT 许可证下发布。
