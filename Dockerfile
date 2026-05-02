FROM node:18-slim

# 安装工具依赖
RUN apt-get update && apt-get install -y ddgr curl python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 18789

CMD ["npm", "start"]
