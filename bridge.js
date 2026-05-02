const http = require('http');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 18789;
const GEMINI_BACKEND = process.env.GEMINI_BACKEND || 'http://127.0.0.1:8080';

const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const data = JSON.parse(body || '{}');
            const msg = data.messages ? data.messages[data.messages.length - 1].content : '';

            // --- 工具识别逻辑 ---
            
            // 1. 搜索工具 (Google Search via ddgr)
            if (msg.includes('搜索')) {
                const query = msg.replace('搜索', '').trim();
                const searchResult = execSync(`ddgr --json -n 3 "${query}"`).toString();
                const results = JSON.parse(searchResult).map(r => `${r.title}: ${r.url}`).join('\\n');
                return sendResponse(res, `[工具调用: Search] 找到以下结果：\\n${results}`);
            }

            // 2. 时间工具 (Clock)
            if (msg.includes('几点')) {
                const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
                return sendResponse(res, `[工具调用: Clock] 现在的北京时间是：${time}`);
            }

            // --- 普通对话转发 ---
            const proxyReq = http.request(GEMINI_BACKEND + req.url, {
                method: req.method,
                headers: { ...req.headers, 'host': '127.0.0.1:8080' }
            }, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });
            proxyReq.write(body);
            proxyReq.end();
        } catch (e) {
            res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
        }
    });
});

function sendResponse(res, text) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        id: 'chatcmpl-' + Date.now(),
        choices: [{ message: { role: 'assistant', content: text }, finish_reason: 'stop' }]
    }));
}

server.listen(PORT, '0.0.0.0', () => console.log(`Gemini Tool Bridge running on port ${PORT}`));
