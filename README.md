# Gemini Tool Bridge 🚀

这是一个将 **Gemini 网页版 API (geminiweb2api)** 与 **本地工具箱 (OpenClaw/CLI)** 完美结合的中转网关。

### ✨ 特性
- **免费大脑**：通过 geminiweb2api 接入免费的 Gemini 模型。
- **智能工具**：
  - 🔍 **联网搜索**：自动识别“搜索”关键字并调用 ddgr 获取实时结果。
  - ⏰ **精准时钟**：自动识别“几点”关键字并返回服务器当前时间。
- **OpenAI 兼容**：标准 `/v1/chat/completions` 接口，可直接接入 NextChat、OneAPI 等客户端。

### 🛠️ 快速开始

1. **部署后端**：
   先确保你运行了 [geminiweb2api](https://github.com/XxxXTeam/geminiweb2api) 在 8080 端口。

2. **运行网关**：
   ```bash
   node bridge.js
   ```

3. **调用测试**：
   ```bash
   curl -X POST http://localhost:18789/v1/chat/completions \
   -H "Content-Type: application/json" \
   -d '{"messages": [{"role": "user", "content": "搜索一下今天的科技新闻"}]}'
   ```

### 📦 依赖
- Node.js
- ddgr (用于搜索工具)
