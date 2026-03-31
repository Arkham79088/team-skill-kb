#!/bin/bash

# 团队技能知识库平台 - 快速部署脚本
# 使用方法：bash deploy.sh

set -e

echo "🚀 开始部署团队技能知识库平台..."

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到 Python3，请先安装 Python 3.9+"
    exit 1
fi

echo "✅ Python 版本：$(python3 --version)"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "⚠️  警告：未找到 Node.js，前端构建将跳过"
    SKIP_FRONTEND=true
else
    echo "✅ Node.js 版本：$(node --version)"
    SKIP_FRONTEND=false
fi

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p backend/data
mkdir -p data

# 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
pip3 install -r requirements.txt
cd ..

# 初始化数据库
echo "🗄️  初始化数据库..."
cd backend
python3 -c "
from database import engine, Base
from models import Case, Rule, AntiPattern, User, Adoption
Base.metadata.create_all(bind=engine)
print('✅ 数据库初始化完成')
"
cd ..

# 解析现有数据
echo "📝 解析现有 Markdown 数据..."
cd backend
python3 parser.py
cd ..

# 构建前端（如果有 Node.js）
if [ "$SKIP_FRONTEND" = false ]; then
    echo "🎨 构建前端..."
    cd frontend
    
    # 安装依赖
    npm install
    
    # 构建生产版本
    npm run build
    
    cd ..
    echo "✅ 前端构建完成"
else
    echo "⚠️  跳过前端构建（无 Node.js）"
fi

# 创建.env 文件
echo "⚙️  创建环境配置..."
cat > .env << EOF
DATABASE_URL=sqlite:///./data/skill_kb.db
SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "本地开发启动："
echo "  后端：cd backend && uvicorn main:app --reload --port 8000"
echo "  前端：cd frontend && npm run dev"
echo ""
echo "生产环境部署："
echo "  1. 将此项目推送到 GitHub"
echo "  2. 在 Railway.app 导入仓库"
echo "  3. 配置环境变量（参考 README.md）"
echo ""
echo "📖 详细文档：README.md"
echo ""
