#!/bin/bash

# Render.com 一键部署脚本
# 帮助你将团队技能知识库快速部署到 Render 平台

set -e

echo "🚀 Render.com 一键部署脚本"
echo "=========================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Git 是否安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ 错误：未找到 Git${NC}"
    echo "请先安装 Git: https://git-scm.com/"
    exit 1
fi

# 检查是否在正确的目录
if [ ! -f "render.yaml" ]; then
    echo -e "${RED}❌ 错误：未找到 render.yaml${NC}"
    echo "请在项目根目录运行此脚本"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 步骤 1: 初始化 Git 仓库
echo -e "${YELLOW}📦 步骤 1: 准备 Git 仓库${NC}"
if [ ! -d ".git" ]; then
    echo "初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
else
    echo -e "${GREEN}✅ Git 仓库已存在${NC}"
fi
echo ""

# 步骤 2: 推送到 GitHub
echo -e "${YELLOW}📤 步骤 2: 推送到 GitHub${NC}"
echo "请确保你已在 GitHub 创建新仓库"
echo ""
read -p "输入你的 GitHub 仓库 URL (如：https://github.com/username/repo.git): " GITHUB_URL

if git remote | grep -q "^origin$"; then
    git remote set-url origin "$GITHUB_URL"
else
    git remote add origin "$GITHUB_URL"
fi

git branch -M main 2>/dev/null || true
git push -u origin main

echo -e "${GREEN}✅ 代码已推送到 GitHub${NC}"
echo ""

# 步骤 3: 生成安全密码
echo -e "${YELLOW}🔐 步骤 3: 生成安全配置${NC}"

ADMIN_PASSWORD=$(openssl rand -base64 24)
JWT_SECRET=$(openssl rand -hex 32)

echo "管理员密码：$ADMIN_PASSWORD"
echo "JWT 密钥：$JWT_SECRET"
echo ""
echo -e "${YELLOW}⚠️  请保存这两个值！稍后需要在 Render 控制台设置${NC}"
echo ""
read -p "按回车继续..."

# 步骤 4: 提供 Render 部署指引
echo -e "${YELLOW}🌐 步骤 4: Render 部署指引${NC}"
echo ""
echo "请按以下步骤在 Render 完成部署："
echo ""
echo "1️⃣  访问 https://dashboard.render.com/ 并登录"
echo ""
echo "2️⃣  点击 New + → Blueprint"
echo "    选择你的 GitHub 仓库：$(echo $GITHUB_URL | sed 's|.git$||')"
echo ""
echo "3️⃣  Render 会自动识别 render.yaml，点击 Apply"
echo ""
echo "4️⃣  设置环境变量（在后端服务）："
echo "    ADMIN_PASSWORD = $ADMIN_PASSWORD"
echo "    JWT_SECRET = $JWT_SECRET"
echo "    DEBUG = false"
echo "    CORS_ORIGINS = https://team-skill-kb.onrender.com"
echo ""
echo "5️⃣  等待 5-10 分钟，部署完成后即可访问！"
echo ""

echo -e "${GREEN}🎉 部署指引完成！${NC}"
echo ""

# 创建配置备份文件
cat > render-env-backup.txt << EOF
Render 环境变量配置
==================

后端服务 (team-skill-kb-api):
ADMIN_PASSWORD=$ADMIN_PASSWORD
JWT_SECRET=$JWT_SECRET
DEBUG=false
CORS_ORIGINS=https://team-skill-kb.onrender.com

前端服务 (team-skill-kb-frontend):
VITE_API_BASE_URL=(自动填充)

生成时间：$(date)
EOF

echo -e "${GREEN}✅ 配置已保存到 render-env-backup.txt${NC}"
echo ""

echo "📖 详细文档请查看：RENDER-DEPLOY.md"
echo ""
echo "祝部署顺利！🚀"
