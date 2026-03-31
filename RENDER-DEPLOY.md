# 🚀 Render.com 免费部署指南

> 完全免费的云端部署方案，30 分钟上线你的团队技能知识库！

---

## 🎯 为什么选择 Render？

### ✅ 免费额度

| 资源 | 免费额度 | 说明 |
|------|---------|------|
| **Web Service** | 512MB RAM | 自动休眠（15 分钟无访问） |
| **PostgreSQL** | 1GB 存储 | 90 天有效期 |
| **带宽** | 100GB/月 | 充足使用 |
| **构建分钟数** | 500 分钟/月 | 每月自动重置 |

### ⚠️ 限制说明

1. **休眠机制** - 15 分钟无访问自动休眠，首次访问需等待 30-50 秒唤醒
2. **数据库有效期** - 免费数据库 90 天后过期（可手动备份或升级）
3. **性能限制** - 512MB RAM，适合 5-10 人小团队

### 💰 成本

**首 3 个月：$0/月** （完全免费）

3 个月后选项：
- 续费数据库：$7/月
- 升级 Web Service：$7/月（不休眠）
- 总计：$14/月（付费后性能更好）

---

## 📋 部署前准备

### 1. 注册 Render 账号

1. 访问 https://render.com/
2. 点击 **Get Started for Free**
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 2. 准备项目代码

确保你的项目包含以下文件（已为你准备好）：

```
team-skill-knowledge-base/
├── render.yaml              # ✅ Render 部署配置
├── backend/
│   ├── main.py             # ✅ FastAPI 应用入口
│   ├── render-requirements.txt  # ✅ 依赖列表
│   └── ...
└── frontend/
    ├── render-build.sh     # ✅ 构建脚本
    ├── package.json        # ✅ Node.js 配置
    └── ...
```

### 3. 生成安全密码

```bash
# 生成管理员密码（至少 12 位）
openssl rand -base64 24

# 生成 JWT 密钥
openssl rand -hex 32
```

**保存这两个值！** 稍后需要设置。

---

## 🚀 部署步骤（30 分钟）

### 步骤 1：上传代码到 GitHub

```bash
# 进入项目目录
cd /Users/arkham/wukong/team-skill-knowledge-base

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Ready for Render deployment"

# 创建 GitHub 仓库并推送
# （在 GitHub 网站创建新仓库后）
git remote add origin https://github.com/你的用户名/team-skill-kb.git
git branch -M main
git push -u origin main
```

### 步骤 2：创建 Render 服务

1. **登录 Render 控制台**
   - 访问 https://dashboard.render.com/

2. **点击 New + → Blueprint**
   - 选择 **Connect repository**
   - 选择你的 GitHub 仓库 `team-skill-kb`
   - 点击 **Connect repository**

3. **Render 会自动识别 `render.yaml`**
   - 看到配置预览后，点击 **Apply**

### 步骤 3：设置环境变量

在 Render 控制台，依次设置以下变量：

#### 后端服务 (`team-skill-kb-api`)

| Key | Value | 说明 |
|-----|-------|------|
| `ADMIN_PASSWORD` | `你生成的强密码` | 管理员登录密码 |
| `JWT_SECRET` | `你生成的随机密钥` | JWT 签名密钥 |
| `DEBUG` | `false` | 生产环境关闭调试 |
| `CORS_ORIGINS` | `https://team-skill-kb.onrender.com` | 允许的前端域名 |

#### 前端服务 (`team-skill-kb-frontend`)

| Key | Value | 说明 |
|-----|-------|------|
| `VITE_API_BASE_URL` | `自动填充` | 指向后端 API URL |

**设置方法：**
1. 点击服务名称
2. 进入 **Environment** 标签
3. 点击 **Add Environment Variable**
4. 输入 Key 和 Value
5. 点击 **Save Changes**

### 步骤 4：等待部署完成

Render 会自动执行：

```
🔄 正在构建后端...
✅ 后端构建成功

🔄 正在构建前端...
✅ 前端构建成功

🔄 正在部署数据库...
✅ 数据库就绪

🎉 部署完成！
```

**预计时间：** 5-10 分钟

### 步骤 5：获取访问地址

部署完成后，你会看到两个 URL：

- **前端应用**: `https://team-skill-kb.onrender.com`
- **后端 API**: `https://team-skill-kb-api.onrender.com`

**点击前端 URL 即可访问你的应用！**

---

## 🧪 验证部署

### 1. 访问首页

打开浏览器，访问前端 URL：
- 应该看到统计看板
- 加载时间：首次 30-50 秒（唤醒），之后秒开

### 2. 测试 API

访问健康检查端点：
```
https://team-skill-kb-api.onrender.com/api/health
```

应返回：
```json
{"status": "healthy", "database": "connected"}
```

### 3. 测试功能

- [ ] 查看规则库列表
- [ ] 搜索规则
- [ ] 查看案例详情
- [ ] 提交新案例（测试表单提交）

### 4. 检查数据库

在 Render 控制台：
1. 点击 **team-skill-db**
2. 进入 **Data** 标签
3. 应该能看到导入的数据

---

## 🔧 常见问题排查

### 问题 1：部署失败

**症状：** Build Failed 或 Deploy Failed

**解决方法：**
```bash
# 查看构建日志
# 在 Render 控制台 → Logs 标签

# 常见错误：
# - 依赖安装失败 → 检查 render-requirements.txt
# - 构建超时 → 免费计划限制，重试即可
# - 端口错误 → 确保使用 $PORT 环境变量
```

### 问题 2：页面空白

**症状：** 前端加载后显示空白

**解决方法：**
1. 打开浏览器控制台（F12）
2. 查看 Network 标签
3. 检查 API 请求是否失败
4. 确认 `VITE_API_BASE_URL` 设置正确

### 问题 3：数据库连接失败

**症状：** API 返回 500 错误

**解决方法：**
1. 检查 `DATABASE_URL` 是否自动设置
2. 在 Render 控制台重启数据库
3. 重新部署后端服务

### 问题 4：唤醒时间过长

**症状：** 每次访问都要等 30 秒以上

**解决方法：**
- **方案 A**：升级到付费计划（$7/月，不休眠）
- **方案 B**：使用监控服务定期访问（如 UptimeRobot）
- **方案 C**：分享给团队成员，增加访问频率

---

## 📊 部署架构

```
┌─────────────────┐
│   用户浏览器    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Render CDN     │  ← 静态资源加速
│  (前端页面)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Web Service    │  ← FastAPI 后端
│  (Python 3.9)   │     512MB RAM
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL DB  │  ← 数据存储
│  (1GB 免费)     │
└─────────────────┘
```

---

## 💾 数据备份策略

### 自动备份（推荐）

Render 免费计划包含：
- 每日自动备份
- 保留 7 天
- 可在控制台恢复

### 手动备份

```bash
# 导出数据库
# 在 Render 控制台 → Database → Export

# 或使用 pg_dump
pg_dump $DATABASE_URL > backup.sql
```

### 90 天后处理

免费数据库 90 天后会过期，你有三个选择：

1. **升级到付费数据库** - $7/月，数据保留
2. **导出后重新创建** - 免费数据库循环使用
3. **迁移到其他平台** - 使用迁移工具

---

## 📈 性能优化建议

### 1. 启用自动部署

在 Render 控制台：
- Settings → Auto-Deploy → **Enabled**
- 每次 Git 推送自动更新

### 2. 配置自定义域名（可选）

1. Settings → Custom Domain
2. 添加你的域名
3. 配置 DNS CNAME 记录
4. 自动 HTTPS 证书

### 3. 优化唤醒速度

- 添加简单的首页预加载
- 使用 CDN 加速静态资源
- 减少初始加载的 API 请求

---

## 🆘 获取帮助

### Render 官方资源

- 📖 文档：https://docs.render.com/
- 💬 Discord: https://discord.gg/render
- 🐛 Issues: GitHub 提 Issue

### 项目特定问题

如果遇到本项目相关问题：
1. 检查 `RENDER-DEPLOY.md` 故障排查章节
2. 查看 Render 控制台日志
3. 联系项目维护者

---

## 📝 下一步行动

### 部署完成后

1. ✅ 邀请团队成员访问
2. ✅ 测试所有核心功能
3. ✅ 收集初期反馈
4. ✅ 记录使用数据

### 3 个月后决策

根据使用情况决定：
- 继续使用免费版（接受休眠）
- 升级到付费版（$14/月）
- 迁移到其他平台

---

## 🎉 总结

**你刚刚完成了：**
- ✅ 零成本部署全栈应用
- ✅ 配置 PostgreSQL 数据库
- ✅ 设置自动部署流程
- ✅ 获得团队专属访问地址

**总耗时：** 30 分钟  
**总成本：** $0/月（首 3 个月）

**现在就和团队成员分享你的知识库平台吧！** 🚀

---

## 📞 快速参考

| 操作 | 位置 |
|------|------|
| 查看日志 | Dashboard → Services → Logs |
| 重启服务 | Dashboard → Services → Restart |
| 修改配置 | Dashboard → Services → Environment |
| 导出数据 | Dashboard → Database → Export |
| 升级计划 | Dashboard → Settings → Upgrade |

**祝你部署顺利！** 🎊