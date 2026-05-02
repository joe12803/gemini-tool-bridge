#!/bin/bash
# Gemini Tool Bridge 一键安装脚本

echo "开始安装依赖..."

# 1. 更新系统并安装基础工具
sudo apt-get update
sudo apt-get install -y curl git python3 nodejs npm ddgr

# 2. 安装 Docker (如果不存在)
if ! command -v docker &> /dev/null; then
    echo "正在安装 Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
fi

# 3. 安装项目依赖
npm install

echo "安装完成！"
