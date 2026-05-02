# Gemini Tool Bridge + OpenClaw 🤖

本项目不仅是一个简单的 API 中转，更是为 **OpenClaw-Zero-Token** 量身定制的“大脑适配器”。

---

## 🏗️ 工业级全栈架构

1. **[大脑] geminiweb2api (8080)**: 网页版 Gemini 转换。
2. **[适配] Gemini-Tool-Bridge (18789)**: 格式标准化与协议转换（本项目）。
3. **[助手] OpenClaw (18789)**: 统领全局，调用各种高级工具。

---

## 🚀 深度集成步骤 (如何让 OpenClaw 用上它)

如果你已经在一台新服务器上克隆了 `openclaw-zero-token`，请按以下步骤配置：

### 1. 运行适配器
```bash
docker run -d --name gemini-bridge -p 18789:18789 joe12803/gemini-tool-bridge
```

### 2. 配置 OpenClaw
在 OpenClaw 目录下执行以下命令，将适配器注册为“通道”：

```bash
# 进入 OpenClaw 目录
cd openclaw-zero-token

# 添加通道 (指向我们的适配器端口)
node openclaw.mjs channels add --id gemini-free --type openai --base-url http://127.0.0.1:18789/v1 --api-key sk-123456

# 设置为默认大脑
node openclaw.mjs config set agents.defaults.model.primary gemini-free/gemini-3-flash
```

### 3. 测试 OpenClaw 的高级工具
现在你可以使用 OpenClaw 所有的重型工具了：
```bash
# 让 OpenClaw 帮你改写服务器上的一个文件
node openclaw.mjs agent --message "读取 /etc/hosts 文件并告诉我内容" --deliver
```

---

## 💡 为什么需要这一层 Bridge？
OpenClaw 对后台 API 的格式要求非常严苛（必须有 `/v1/models` 响应，必须有标准的 Header）。
直接接入 `geminiweb2api` 往往会因为路径或权限问题报错，本 Bridge 完美解决了这些“琐事”。
