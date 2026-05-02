# Gemini Tool Bridge 🚀

本项目是一个智能 AI 网关，旨在将 **免费的 Gemini 网页版 (via geminiweb2api)** 与 **本地/公网工具 (如搜索、时钟、CLI)** 深度集成，实现真正具备“行动能力”的免费 AI 接口。

---

## 🏗️ 工作原理

```text
用户请求 (curl/NextChat) -> Bridge (本项目 18789) 
                              |
            -------------------------------------
            |                                   |
    匹配工具关键词? (搜索/几点)          普通对话转发
            |                                   |
      调用本地 CLI (ddgr/Date)         Gemini 后端 (8080)
```

---

## 🚀 快速复现 (另一台服务器)

### 第一步：部署 Gemini 后端 (geminiweb2api)
你需要在服务器上先跑起 Gemini 的网页转 API 服务：
```bash
docker run -d --name gemini-backend -p 8080:8080 xxxx/geminiweb2api
```
*注意：请在配置中设置好你的 Gemini Cookie。*

### 第二步：部署本项目 (Gemini Tool Bridge)

#### 方式 A：Docker 一键部署 (推荐)
```bash
# 1. 克隆代码
git clone https://github.com/joe12803/gemini-tool-bridge.git
cd gemini-tool-bridge

# 2. 构建并运行
docker build -t gemini-tool-bridge .
docker run -d \
  --name gemini-bridge \
  -p 18789:18789 \
  -e GEMINI_BACKEND="http://你的服务器IP:8080" \
  gemini-tool-bridge
```

#### 方式 B：手动部署
1. 安装依赖：`apt install ddgr nodejs`
2. 运行：`npm install && node bridge.js`

---

## 🧪 功能验证

### 1. 验证联网搜索 (Google Search)
```bash
curl -X POST http://localhost:18789/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "user", "content": "搜索一下 2026年最新AI技术"}]}'
```

### 2. 验证本地工具 (Clock)
```bash
curl -X POST http://localhost:18789/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "user", "content": "现在几点？"}]}'
```

---

## 💡 如何增加新工具？
打开 `bridge.js`，在逻辑判断处增加你的代码即可。例如增加一个“查天气”：
```javascript
if (msg.includes('天气')) {
    const city = msg.replace('天气', '').trim();
    const weather = execSync(`curl -s wttr.in/${city}?format=3`).toString();
    return sendResponse(res, weather);
}
```

---

## ⚠️ 注意事项
1. **端口开放**：请确保防火墙已开启 `18789` (网关) 和 `8080` (后端) 端口。
2. **API Key**：请求网关时，`Authorization` 请与你 Gemini 后端的配置保持一致。
