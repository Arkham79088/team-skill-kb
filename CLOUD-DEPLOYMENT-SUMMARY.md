# ☁️ 云部署方案总结

> 📋 一页纸掌握所有部署选项，快速做出决策

---

## 🎯 推荐方案：Railway 一键部署

### 为什么选择 Railway？

| 维度 | Railway | 其他平台 |
|------|---------|----------|
| **上手难度** | ⭐⭐⭐⭐⭐ 极简 | ⭐⭐⭐ 需配置 |
| **全栈支持** | ✅ Python + Node.js | ⚠️ 部分支持 |
| **数据库** | ✅ 内置 PostgreSQL | ❌ 需额外配置 |
| **价格** | $5/月起 | $7-20/月 |
| **部署速度** | 5-10 分钟 | 15-30 分钟 |
| **适合人群** | 新手/小团队 | 开发者/企业 |

### 快速开始（30 分钟）

```bash
# 1. 安装 CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 一键部署
./deploy-to-railway.sh
```

**✅ 完成后获得：**
- 前端应用 URL
- 后端 API URL
- PostgreSQL 数据库
- 私有访问控制

**💰 成本：** ~$12/月（计算$5 + 数据库$7）

---

## 🔄 备选方案对比

### 方案 B：Docker + 任意云平台

**适合场景：**
- 已有云服务器（阿里云/腾讯云/AWS）
- 需要完全控制权
- 有 Docker 使用经验

**部署平台：**
- DigitalOcean App Platform ($6/月)
- Google Cloud Run (按量付费)
- AWS ECS/Fargate (~$10/月)
- 阿里云容器服务 (~¥50/月)

**步骤：**
```bash
# 构建镜像
docker build -t team-skill-kb .

# 推送到 Registry
docker push your-registry/team-skill-kb

# 部署到云平台
# （各平台命令不同）
```

**⏱️ 耗时：** 1-2 小时  
**💰 成本：** $6-15/月

---

### 方案 C：Vercel + Supabase

**适合场景：**
- 追求极致性能
- 需要全球 CDN
- 熟悉 Vercel 生态

**架构：**
- 前端：Vercel（免费额度内）
- 后端：Vercel Serverless Functions
- 数据库：Supabase PostgreSQL（免费 500MB）

**⏱️ 耗时：** 1-2 小时  
**💰 成本：** $0-20/月（取决于用量）

---

### 方案 D：Render.com

**适合场景：**
- 需要免费套餐
- 简单部署流程

**特点：**
- 免费套餐：Web Service + PostgreSQL
- 自动 HTTPS
- 持续部署

**限制：**
- 免费套餐会休眠（首次访问需唤醒）
- 资源有限（512MB RAM）

**⏱️ 耗时：** 30 分钟  
**💰 成本：** $0（免费）或 $7/月（标准版）

---

## 📊 完整成本对比表

| 方案 | 首月成本 | 月度成本 | 难度 | 推荐度 |
|------|---------|---------|------|--------|
| **Railway** | ~$12 | ~$12 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Docker + DO** | ~$6 | ~$6 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Vercel + Supabase** | $0 | $0-20 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Render** | $0 | $0-7 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **AWS/GCP** | $10-50 | $10-50 | ⭐⭐ | ⭐⭐ |

---

## 🔒 安全配置清单

无论选择哪个平台，都必须配置：

### 环境变量

```bash
# 必须设置
ADMIN_PASSWORD=强密码（至少 12 位）
JWT_SECRET=$(openssl rand -hex 32)
DATABASE_URL=数据库连接字符串

# 推荐设置
CORS_ORIGINS=https://your-domain.com
DEBUG=false
ENVIRONMENT=production
```

### 访问控制

- [ ] 启用平台级 Authentication
- [ ] 设置访问密码或邀请码
- [ ] 限制 IP 范围（可选）
- [ ] 配置 HTTPS（大多数平台自动提供）

### 数据备份

- [ ] SQLite：定期导出 `.dump`
- [ ] PostgreSQL：使用平台自动备份
- [ ] 代码：推送到 GitHub 私有仓库

---

## 🎯 决策树

```
你有云服务器吗？
    │
    ├─ 是 ──► 方案 B：Docker 部署
    │
    └─ 否
         │
         ▼
    想要最简单？
         │
         ├─ 是 ──► 方案 A：Railway（强烈推荐）
         │
         └─ 否
              │
              ▼
         想要免费？
              │
              ├─ 是 ──► 方案 D：Render
              │
              └─ 否
                   │
                   ▼
              追求性能？
                   │
                   ├─ 是 ──► 方案 C：Vercel + Supabase
                   │
                   └─ 否 ──► 回到 Railway
```

---

## 📈 扩展路径

### 阶段 1：MVP 验证（当前）

- 5-10 人团队
- Railway 基础配置
- SQLite/PostgreSQL
- 月度成本：$12

### 阶段 2：增长期（10-50 人）

- 升级到 Railway Pro
- 添加 Redis 缓存
- 配置 CDN
- 月度成本：$30-50

### 阶段 3：成熟期（50+ 人）

- 迁移到 Kubernetes
- 多区域部署
- 监控告警系统
- 月度成本：$100+

---

## 🆘 常见问题速查

### Q1: 部署失败怎么办？

**A:** 查看日志 `railway logs`，常见原因：
- 依赖安装失败 → 检查 requirements.txt / package.json
- 端口冲突 → 确认使用正确端口（8000/3000）
- 环境变量缺失 → 检查所有必需变量

### Q2: 数据库连接不上？

**A:** 
- 检查 DATABASE_URL 格式
- 确认数据库插件已添加
- 查看网络连接是否通畅

### Q3: 前端访问后端 403？

**A:** 
- CORS 配置错误
- 更新 CORS_ORIGINS 包含前后端域名
- 重启服务使配置生效

### Q4: 成本超出预期？

**A:**
- 开启休眠模式（节省 50%）
- 降级到 SQLite（省$7/月）
- 检查是否有异常流量

---

## 📞 获取帮助

### 官方文档

- [Railway 文档](https://docs.railway.app/)
- [FastAPI 部署](https://fastapi.tiangolo.com/deployment/)
- [React 生产环境](https://react.dev/learn/deployment)

### 社区支持

- Railway Discord: https://discord.gg/railway
- GitHub Issues: 项目仓库提 Issue
- Stack Overflow: 标签 `railway-app` `fastapi`

---

## ✅ 行动清单

### 立即执行（今天）

1. [ ] 注册 Railway 账号
2. [ ] 安装 Railway CLI
3. [ ] 运行部署脚本
4. [ ] 测试基本功能

### 本周完成

1. [ ] 配置自定义域名（可选）
2. [ ] 启用私有访问控制
3. [ ] 邀请团队成员
4. [ ] 收集使用反馈

### 本月优化

1. [ ] 监控资源使用
2. [ ] 优化数据库查询
3. [ ] 规划功能迭代
4. [ ] 设置自动备份

---

**🚀 现在开始部署吧！**

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base
./deploy-to-railway.sh
```

**详细步骤请参考：**
- 📖 [CLOUD-DEPLOY.md](./CLOUD-DEPLOY.md) - 完整部署指南
- 📋 [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - 检查清单
- 🗺️ [DEPLOYMENT-FLOW.md](./DEPLOYMENT-FLOW.md) - 可视化流程图
