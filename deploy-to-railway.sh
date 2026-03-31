#!/bin/bash

# ============================================
# 团队技能知识库 - Railway 一键部署脚本
# ============================================
# 使用方法：./deploy-to-railway.sh
# ============================================

set -e

echo "🚀 开始部署到 Railway..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Railway CLI 是否安装
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}❌ Railway CLI 未安装${NC}"
        echo "请先运行：npm install -g @railway/cli"
        exit 1
    fi
    echo -e "${GREEN}✅ Railway CLI 已安装${NC}"
}

# 登录 Railway
login_railway() {
    echo -e "${YELLOW}📝 登录 Railway...${NC}"
    railway login
    echo -e "${GREEN}✅ 登录成功${NC}"
}

# 初始化项目
init_project() {
    echo -e "${YELLOW}📦 初始化 Railway 项目...${NC}"
    railway init
    echo -e "${GREEN}✅ 项目初始化完成${NC}"
}

# 设置环境变量
setup_variables() {
    echo -e "${YELLOW}⚙️  配置环境变量...${NC}"
    
    # 管理员密码
    read -p "设置管理员密码（至少 12 位）: " -s ADMIN_PASSWORD
    echo ""
    railway vars set ADMIN_PASSWORD="$ADMIN_PASSWORD"
    
    # JWT 密钥
    JWT_SECRET=$(openssl rand -hex 32)
    railway vars set JWT_SECRET="$JWT_SECRET"
    
    # CORS 来源（稍后更新）
    railway vars set CORS_ORIGINS="*"
    
    echo -e "${GREEN}✅ 环境变量配置完成${NC}"
}

# 添加数据库
add_database() {
    echo -e "${YELLOW}🗄️  创建 PostgreSQL 数据库...${NC}"
    railway add postgresql
    echo -e "${GREEN}✅ 数据库创建成功${NC}"
}

# 部署后端
deploy_backend() {
    echo -e "${YELLOW}🔧 部署后端服务...${NC}"
    cd backend
    railway up
    cd ..
    echo -e "${GREEN}✅ 后端部署完成${NC}"
}

# 部署前端
deploy_frontend() {
    echo -e "${YELLOW}🎨 部署前端服务...${NC}"
    cd frontend
    railway up --name team-skill-kb-frontend
    cd ..
    echo -e "${GREEN}✅ 前端部署完成${NC}"
}

# 获取部署信息
get_deployment_info() {
    echo -e "${YELLOW}📊 获取部署信息...${NC}"
    
    BACKEND_URL=$(railway status | grep "Backend" | awk '{print $2}')
    FRONTEND_URL=$(railway status | grep "Frontend" | awk '{print $2}')
    
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo "📍 后端 API: $BACKEND_URL"
    echo "🌐 前端应用：$FRONTEND_URL"
    echo ""
    echo -e "${YELLOW}⚠️  重要提示：${NC}"
    echo "1. 访问前端地址测试功能"
    echo "2. 在 Railway 控制台启用 Authentication"
    echo "3. 配置自定义域名（可选）"
    echo ""
}

# 主流程
main() {
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}团队技能知识库 - Railway 部署向导${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    
    check_railway_cli
    echo ""
    
    login_railway
    echo ""
    
    init_project
    echo ""
    
    setup_variables
    echo ""
    
    add_database
    echo ""
    
    deploy_backend
    echo ""
    
    deploy_frontend
    echo ""
    
    get_deployment_info
    
    echo -e "${GREEN}✅ 所有步骤完成！${NC}"
}

# 运行主流程
main
