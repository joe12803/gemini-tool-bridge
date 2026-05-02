# Gemini Tool Bridge + OpenClaw 🤖

本项目是一个工业级的 AI Agent 枢纽，将 **免费的 Gemini 网页版 API (via geminiweb2api)** 与 **OpenClaw-Zero-Token** 深度集成，实现具备强大工具调用能力的免费 AI 助手。

---

## ⚡ 极速复现 (快速开始)

在新服务器上部署，仅需以下几步：

### 1. 克隆与安装环境
```bash
git clone https://github.com/joe12803/gemini-tool-bridge.git
cd gemini-tool-bridge

# 一键安装所有依赖 (Node.js, Docker, ddgr 等)
chmod +x install.sh
./install.sh
```

### 2. 配置并一键启动
确保你的 `geminiweb2api` 已在 8080 端口运行，然后执行：
```bash
# 一键启动适配器网关
chmod +x start.sh
./start.sh
```

---

## 🏗️ 工业级全栈架构

1. **[大脑] geminiweb2api (8080)**: 网页版 Gemini 转换。
2. **[枢纽] Gemini-Tool-Bridge (18789)**: 协议标准化（本项目）。
3. **[统领] OpenClaw (18789)**: 调度高级工具（搜索、执行代码、文件管理）。

---

## 🚀 深度集成 OpenClaw

当适配器启动后，你可以让 OpenClaw 接管它：

```bash
cd openclaw-zero-token

# 注册通道
node openclaw.mjs channels add --id gemini-free --type openai --base-url http://127.0.0.1:18789/v1 --api-key sk-123456

# 设置默认模型
node openclaw.mjs config set agents.defaults.model.primary gemini-free/gemini-3-flash
```

---

## 🧪 功能验证

测试适配器是否已成功打通大脑与工具：

```bash
# 测试搜索工具
curl -X POST http://localhost:18789/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "user", "content": "搜索一下今天的科技新闻"}]}'
```

---

## 💡 为什么需要这一层 Bridge？
OpenClaw 对后台 API 的规范性要求极高。本 Bridge 提供了标准的 `/v1/models` 响应、自动化的 Header 注入以及针对网页版 API 的路径修正，是 OpenClaw 稳定运行的基石。
