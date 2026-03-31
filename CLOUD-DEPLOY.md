# ☁️ 团队技能知识库 - 云部署完整指南

> 🚀 5 分钟部署到 Railway，让团队成员立即访问你的知识库平台

---

## 📋 部署前准备

### 必需账号

1. **GitHub 账号** - 用于代码托管（免费）
2. **Railway 账号** - 用于云端部署（$5/月起步）
3. **邮箱** - 用于接收部署通知

### 环境检查清单

- ✅ 本地测试通过（可选但推荐）
- ✅ 所有代码已提交到 Git 仓库
- ✅ 准备好强密码（用于管理员登录）
- ✅ 团队域名（可选，如 `skills.yourteam.com`）

---

## 🎯 方案 A：Railway 一键部署（强烈推荐）

### 为什么选择 Railway？

| 特性 | Railway | Vercel | Render |
|------|---------|--------|--------|
| **全栈支持** | ✅ Python + Node.js | ⚠️ 主要前端 | ✅ 支持 |
| **数据库** | ✅ 内置 PostgreSQL | ❌ 需第三方 | ✅ 支持 |
| **部署速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **价格** | $5/月起 | $20/月 | $7/月 |
| **适合新手** | ✅ 极简 UI | ⚠️ 需配置 | ⚠️ 较复杂 |

---

### 步骤 1：准备工作（3 分钟）

#### 1.1 安装 Railway CLI

```bash
npm install -g @railway/cli
```

#### 1.2 登录 Railway

```bash
railway login
```

浏览器会自动打开，使用 GitHub 账号授权登录。

#### 1.3 初始化项目

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base
railway init
```

按提示操作：
- 选择 **Create a new project**
- 项目名称：`team-skill-kb`（或你喜欢的名字）

---

### 步骤 2：配置环境变量（2 分钟）

在 Railway 控制台设置以下变量：

```bash
# 管理员密码（务必使用强密码！）
railway vars set ADMIN_PASSWORD=YourStrongPassword123!

# JWT 密钥（用于 Token 加密）
railway vars set JWT_SECRET=$(openssl rand -hex 32)

# 允许的来源（前端域名，部署后获取）
railway vars set CORS_ORIGINS=https://your-project.up.railway.app

# 数据库 URL（Railway 会自动生成）
# 先不设置，等创建数据库后自动填充
```

**💡 提示：** 也可以在 Railway 网页控制台的 "Variables" 面板中可视化添加。

---

### 步骤 3：创建数据库（2 分钟）

#### 方式 A：使用 Railway 内置数据库（推荐）

```bash
# 添加 PostgreSQL 插件
railway add postgresql

# 查看数据库连接信息
railway run psql -c "\conninfo"
```

Railway 会自动设置 `DATABASE_URL` 环境变量。

#### 方式 B：继续使用 SQLite（简单但功能有限）

无需额外操作，应用会使用 `backend/data/knowledge_base.db`。

**⚠️ 注意：** SQLite 不适合多用户并发，建议尽快迁移到 PostgreSQL。

---

### 步骤 4：修改代码适配 PostgreSQL

创建数据库迁移脚本：

```bash
# 文件：backend/db_migrate.py
```

内容已在下方提供，稍后我会创建这个文件。

---

### 步骤 5：部署到 Railway（3 分钟）

```bash
# 部署后端
cd backend
railway up

# 部署前端（新建一个服务）
cd ../frontend
railway up --name team-skill-kb-frontend
```

部署完成后，Railway 会显示：
- 后端 API 地址：`https://team-skill-kb-production.up.railway.app`
- 前端地址：`https://team-skill-kb-frontend-production.up.railway.app`

---

### 步骤 6：配置私有访问控制（重要！）

#### 6.1 启用 Railway Authentication

1. 打开 Railway 控制台
2. 进入你的项目 → Settings
3. 找到 **"Authentication"** 部分
4. 开启 **"Require authentication"**
5. 设置访问密码或邀请码

#### 6.2 配置自定义域名（可选）

```bash
# 绑定自定义域名
railway domain set skills.yourteam.com

# 按照提示配置 DNS 记录
# 通常在域名服务商处添加 CNAME 记录
```

---

### 步骤 7：验证部署

访问前端地址，测试以下功能：

- ✅ 统计看板正常显示
- ✅ 规则库可以浏览
- ✅ 案例详情可打开
- ✅ 提交表单能保存

---

## 🎯 方案 B：Docker 部署到任意云平台

如果你更喜欢 Docker，可以部署到任何支持 Docker 的平台。

### 适用平台

- DigitalOcean App Platform
- Google Cloud Run
- AWS ECS/Fargate
- Azure Container Instances
- 阿里云容器服务

### 构建 Docker 镜像

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base

# 构建镜像
docker build -t team-skill-kb:latest .

# 推送到 Docker Hub（或其他 Registry）
docker tag team-skill-kb:latest your-dockerhub-username/team-skill-kb:latest
docker push your-dockerhub-username/team-skill-kb:latest
```

### 部署示例（DigitalOcean）

```bash
# 使用 doctl CLI
doctl apps create --spec digitalocean-app-spec.yaml
```

---

## 🔒 安全配置清单

### 必须配置的安全项

1. **强密码策略**
   ```bash
   # 至少 12 位，包含大小写、数字、特殊字符
   railway vars set ADMIN_PASSWORD="Kj8#mN2$pL9@qR4!"
   ```

2. **JWT 密钥**
   ```bash
   # 使用随机生成的 64 位密钥
   railway vars set JWT_SECRET=$(openssl rand -hex 32)
   ```

3. **CORS 限制**
   ```bash
   # 只允许你的域名访问
   railway vars set CORS_ORIGINS=https://skills.yourteam.com
   ```

4. **数据库备份**
   ```bash
   # Railway 自动备份（PostgreSQL）
   # 或手动导出 SQLite
   sqlite3 backend/data/knowledge_base.db ".dump" > backup.sql
   ```

---

## 📊 成本估算

### Railway 定价（按量付费）

| 资源 | 用量 | 价格 |
|------|------|------|
| **计算资源** | 512MB RAM, 0.5 CPU | ~$5/月 |
| **数据库** | PostgreSQL 基础版 | ~$7/月 |
| **带宽** | 1GB/月 | 免费额度内 |
| **总计** | - | **~$12/月** |

### 优化成本技巧

1. **休眠模式** - 无流量时自动休眠（节省 50%）
2. **SQLite 过渡** - 初期用 SQLite，有活跃用户再升级
3. **监控用量** - Railway 控制台实时查看资源消耗

---

## 🔄 持续集成/持续部署（CI/CD）

### 设置自动部署

1. **连接 GitHub 仓库**
   ```bash
   railway link
   ```

2. **配置自动部署**
   - Railway 会自动监听 `main` 分支
   - 每次 `git push` 都会触发部署

3. **部署预览**（可选）
   - PR/MR 自动创建预览环境
   - 审核通过后再合并到生产环境

---

## 🛠️ 故障排查

### 常见问题及解决方案

#### 问题 1：部署失败，显示 "Build failed"

**原因：** 依赖安装失败或构建错误

**解决：**
```bash
# 查看构建日志
railway logs

# 本地复现构建
docker build -t test-build .
```

#### 问题 2：数据库连接失败

**原因：** DATABASE_URL 未正确设置

**解决：**
```bash
# 检查环境变量
railway vars get DATABASE_URL

# 重新生成
railway add postgresql
```

#### 问题 3：前端无法访问后端 API

**原因：** CORS 配置错误或 API 地址不对

**解决：**
```bash
# 检查 CORS_ORIGINS
railway vars get CORS_ORIGINS

# 确保包含前后端域名
railway vars set CORS_ORIGINS="https://frontend.up.railway.app,https://api.up.railway.app"
```

#### 问题 4：数据丢失

**原因：** 使用了临时存储或未持久化数据库

**解决：**
- Railway 的 PostgreSQL 是持久化的
- SQLite 需要挂载卷：`railway volume add --mount /app/backend/data`

---

## 📈 性能优化

### 数据库优化

1. **添加索引**
   ```sql
   CREATE INDEX idx_cases_category ON cases(category);
   CREATE INDEX idx_rules_frequency ON rules(adoption_count DESC);
   ```

2. **连接池配置**
   ```python
   # SQLAlchemy 连接池
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20,
       pool_recycle=3600
   )
   ```

### 前端优化

1. **启用 CDN**
   - Railway 自动提供全球 CDN
   - 静态资源自动缓存

2. **代码分割**
   - Vite 自动进行 Tree Shaking
   - 按需加载页面组件

---

## 🎓 团队协作配置

### 邀请团队成员

1. **Railway 团队协作**
   - 控制台 → Settings → Team
   - 邀请成员邮箱
   - 分配角色（Admin/Developer/Viewer）

2. **应用访问控制**
   - 设置统一的管理员密码
   - 或使用 OAuth（GitHub/Google 登录）

### 数据同步

如果多个成员需要上传数据：

1. **统一入口** - 通过平台前端提交
2. **定期导出** - 每周导出 Markdown 备份
3. **版本控制** - Git 管理规则变更

---

## 📞 获取帮助

### 官方文档

- [Railway 文档](https://docs.railway.app/)
- [FastAPI 部署指南](https://fastapi.tiangolo.com/deployment/)
- [React 生产部署](https://react.dev/learn/deployment)

### 社区支持

- Railway Discord: https://discord.gg/railway
- GitHub Issues: 项目仓库提 Issue

---

## ✅ 部署完成检查清单

部署完成后，请确认：

- [ ] 前端可以正常访问
- [ ] 后端 API 响应正常
- [ ] 数据库连接成功
- [ ] 私有访问控制已启用
- [ ] 管理员密码已设置
- [ ] 域名已配置（可选）
- [ ] 数据库备份策略已设置
- [ ] 团队成员已收到邀请

---

**下一步：** 运行部署脚本，开始云端部署！

```bash
./deploy-to-railway.sh
```
