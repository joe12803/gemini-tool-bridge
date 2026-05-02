#!/bin/bash
# Gemini Tool Bridge 一键启动全栈脚本

# 1. 启动 L1 后端 (geminiweb2api)
if ! docker ps | grep -q "geminiweb2api"; then
    echo "正在启动 Gemini 后端..."
    # 假设你已经配置好了 docker-compose 或镜像，这里使用本地已有的容器
    docker start geminiweb2api || echo "请先确保 geminiweb2api 容器已创建"
fi

# 2. 启动 L2 适配器 (本项目)
echo "正在启动适配器网关 (18789)..."
pkill -f "node bridge.js" || true
nohup node bridge.js > gateway.log 2>&1 &

# 3. 验证启动
sleep 5
if curl -s http://127.0.0.1:18789/v1/models > /dev/null; then
    echo "✅ 全栈服务启动成功！"
    echo "网关地址: http://你的公网IP:18789"
else
    echo "❌ 启动失败，请检查 gateway.log"
fi
