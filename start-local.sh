#!/bin/bash

# 团队技能知识库平台 - 本地启动脚本
# 使用方法：./start-local.sh

echo "🚀 启动团队技能知识库平台..."
echo ""

# 检查是否在项目目录
if [ ! -f "backend/main.py" ]; then
    echo "❌ 请在项目根目录执行此脚本"
    exit 1
fi

# 启动后端服务
echo "📦 启动后端服务 (FastAPI + SQLite)..."
cd backend

if [ ! -d ".venv" ]; then
    echo "   创建虚拟环境..."
    python3 -m venv .venv
fi

echo "   安装依赖..."
source .venv/bin/activate
pip install -q -r requirements.txt

echo "   启动 API 服务器 http://localhost:8000"
echo "   API 文档：http://localhost:8000/docs"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# 等待后端启动
sleep 3

# 启动前端服务
echo ""
echo "🎨 启动前端服务 (React + Vite)..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "   安装依赖 (首次需要几分钟)..."
    npm install
fi

echo "   启动开发服务器 http://localhost:3000"
npm run dev -- --host 0.0.0.0 --port 3000

# 清理进程
kill $BACKEND_PID 2>/dev/null

echo ""
echo "✅ 服务已停止"
