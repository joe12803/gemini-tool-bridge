const http = require('http');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 18789;
const GEMINI_BACKEND = process.env.GEMINI_BACKEND || 'http://127.0.0.1:8080';

const server = http.createServer((req, res) => {
    // 跨域处理
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // 处理模型列表请求 (OpenClaw 启动时会探测)
    if (req.url === '/v1/models') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            object: "list",
            data: [{ id: "gemini-3-flash", object: "model", created: 1677610602, owned_by: "google" }]
        }));
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const data = JSON.parse(body || '{}');
            const messages = data.messages || [];
            const msg = messages.length > 0 ? messages[messages.length - 1].content : '';

            // --- 核心转发逻辑 ---
            const proxyReq = http.request(GEMINI_BACKEND + req.url, {
                method: req.method,
                headers: { 
                    ...req.headers, 
                    'host': '127.0.0.1:8080',
                    'Authorization': 'Bearer sk-123456' // 强制注入后端所需的 Key
                }
            }, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });
            proxyReq.on('error', (err) => {
                res.writeHead(500); res.end(JSON.stringify({ error: "Backend Unreachable: " + err.message }));
            });
            proxyReq.write(body);
            proxyReq.end();
        } catch (e) {
            res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
        }
    });
});

server.listen(PORT, '0.0.0.0', () => console.log(`Gemini Bridge for OpenClaw running on ${PORT}`));
