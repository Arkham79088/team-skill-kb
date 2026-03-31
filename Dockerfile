# 多阶段构建：前端 + 后端一体化部署
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端 package 文件
COPY frontend/package*.json ./
RUN npm install

# 复制前端源码并构建
COPY frontend/ ./
RUN npm run build

# 生产镜像
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ ./backend/

# 复制构建好的前端静态文件
COPY --from=frontend-builder /app/frontend/dist ./static

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
