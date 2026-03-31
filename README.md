# 团队技能知识库平台

> 🚀 专为 AI 团队打造的经验共享平台 - 让每个人的教训都成为团队的财富

![Status](https://img.shields.io/badge/status-ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 项目简介

这是一个**团队技能知识库平台**，帮助团队成员：

- ✅ **分享经验教训** - 将 AI 协作中的踩坑经历转化为结构化案例
- ✅ **提炼通用规则** - 从单个案例中抽象出可复用的改进策略
- ✅ **一键采纳集成** - 看到好规则直接下载到自己的 skill 库
- ✅ **数据统计分析** - 可视化展示高频问题、热门规则、团队贡献

### 核心特性

- 🎯 **完全对齐你的知识体系** - 数据模型基于你现有的 `自我学习 skill` 结构
- 🔒 **私有部署** - 初期邀请制，仅团队内部访问
- ☁️ **云端部署** - Railway.app 一键部署，自动扩容
- 🎨 **现代 UI** - 活泼鲜明的设计风格，告别枯燥的管理后台

---

## 🏗️ 技术架构

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │ ◄──► │  FastAPI     │ ◄──► │   SQLite    │
│  Frontend   │      │   Backend    │      │  Database   │
│  (Vite)     │      │  (Python)    │      │             │
└─────────────┘      └──────────────┘      └─────────────┘
       ▲                     ▲
       │                     │
       └─────────────────────┘
              Railway.app
```

### 技术栈详情

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端** | React + Vite + Ant Design | 18.x |
| **后端** | Python FastAPI | 0.109.0 |
| **数据库** | SQLite → PostgreSQL | 3.x |
| **部署** | Railway.app + Docker | - |
| **认证** | JWT Token | - |

---

## 🚀 快速开始（5 分钟部署上线）

### 前置要求

- ✅ 有一个 GitHub 账号（用于登录 Railway）
- ✅ 本地安装了 Git（可选，用于克隆代码）
- ✅ 有网络访问 Railway.app（可能需要科学上网）

### 第一步：上传代码到 GitHub

#### 方式 A：使用 GitHub Desktop（推荐新手）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开软件，登录 GitHub 账号
3. 点击 `File` → `Add Local Repository` → `Choose...`
4. 选择 `/Users/arkham/wukong/team-skill-knowledge-base` 文件夹
5. 点击 `Commit to main` 输入提交信息如 "Initial commit"
6. 点击右上角 `Publish repository`
7. 填写仓库名称（如 `team-skill-kb`），勾选 `Keep this code private`
8. 点击 `Publish Repository`

#### 方式 B：使用命令行

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/team-skill-kb.git

# 推送
git push -u origin main
```

### 第二步：部署到 Railway

1. **访问 Railway**
   - 打开 https://railway.app/
   - 点击 `Start a New Project`
   - 选择 `Login with GitHub`

2. **创建新项目**
   - 点击 `New Project`
   - 选择 `Deploy from GitHub repo`
   - 在列表中找到并选择你刚创建的 `team-skill-kb` 仓库
   - 点击 `Connect`

3. **配置环境变量**
   - 在项目页面点击 `Variables` 标签
   - 添加以下变量：
     ```
     DATABASE_URL=sqlite:///./data/skill_kb.db
     SECRET_KEY=your-secret-key-here-change-in-production
     ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.railway.app
     ```
   - 点击 `Save`

4. **启动服务**
   - Railway 会自动识别 `railway.json` 并开始构建
   - 等待 3-5 分钟，看到 `Success` 状态
   - 点击 `Generate Domain` 获取公网 URL
   - 你的应用已上线！格式类似：`https://team-skill-kb-production.up.railway.app`

### 第三步：导入现有数据

1. **打开 API 文档**
   - 访问 `https://your-domain.railway.app/docs`
   - 这是 Swagger UI，可以测试所有 API

2. **调用导入接口**
   - 找到 `POST /import` 接口
   - 点击 `Try it out`
   - 点击 `Execute`（会自动解析你现有的 Markdown 文件）

3. **验证数据**
   - 访问前端页面：`https://your-domain.railway.app`
   - 应该能看到：
     - 统计看板显示：1 个案例、4 条规则、2 个反模式
     - 规则库中有 R-001 到 R-004
     - 案例库中有"邮件营销任务"案例

### 第四步：邀请团队成员

1. **生成邀请链接**
   - 目前采用简单邀请制
   - 将你的 Railway 域名发给团队成员即可

2. **后续权限管理**（可选）
   - 如需更严格的访问控制，可在 Railway 设置 IP 白名单
   - 或启用 JWT 认证（代码已包含，需配置 `SECRET_KEY`）

---

## 📁 项目结构

```
team-skill-knowledge-base/
├── backend/                    # 后端代码
│   ├── main.py                # FastAPI 入口
│   ├── models.py              # 数据库模型
│   ├── database.py            # 数据库配置
│   ├── parser.py              # Markdown 解析器
│   ├── routes/                # API 路由（未展开）
│   └── requirements.txt       # Python 依赖
│
├── frontend/                   # 前端代码
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # 统计看板
│   │   │   ├── RuleLibrary.jsx    # 规则库
│   │   │   ├── CaseLibrary.jsx    # 案例库
│   │   │   └── SubmitPage.jsx     # 提交页
│   │   ├── utils/
│   │   │   └── api.js         # API 调用封装
│   │   ├── App.jsx            # 主应用组件
│   │   ├── main.jsx           # React 入口
│   │   └── index.css          # 全局样式
│   ├── package.json           # Node 依赖
│   ├── vite.config.js         # Vite 配置
│   └── index.html             # HTML 入口
│
├── data/                       # 数据目录
│   ├── skill_kb.db           # SQLite 数据库（运行时生成）
│   └── parsed_data.json      # 解析缓存
│
├── Dockerfile                  # Docker 配置
├── railway.json               # Railway 配置
└── README.md                  # 本文件
```

---

## 🔧 本地开发（可选）

如果你想先在本地测试再部署：

### 后端启动

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/backend

# 安装依赖
pip3 install -r requirements.txt

# 启动服务
uvicorn main:app --reload --port 8000
```

访问 http://localhost:8000/docs 查看 API 文档

### 前端启动

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前端

---

## 📊 功能模块说明

### 1. 统计看板（Dashboard）

展示团队知识库的整体状况：

- **总览卡片**：案例数、规则数、反模式数、总采纳次数
- **高频问题 TOP10**：按出现频次排序的问题分类
- **热门规则 TOP10**：被最多人采纳的规则
- **分类分布饼图**：understanding-gap / logic-gap 等占比
- **团队贡献榜**：按提交数量排名

### 2. 规则库（RuleLibrary）

浏览和搜索所有规则：

- **筛选器**：按分类、状态（candidate/stable）、上传者、时间
- **列表视图**：规则卡片展示标题、标签、频次、采纳数
- **详情页**：完整规则内容 + 来源案例 + "添加到我的 skill"按钮
- **一键采纳**：点击下载符合你 skill 格式的 Markdown 文件

### 3. 案例库（CaseLibrary）

查看所有复盘案例：

- **时间线视图**：按日期展示案例
- **搜索功能**：支持标题、需求类型、摘要全文搜索
- **案例详情**：6 个必答问题完整回答 + 提炼的规则列表

### 4. 提交分享（SubmitPage）

上传新的案例和规则：

- **手动填写**：表单形式逐步引导
- **文件上传**：直接上传 retrospective.md 自动解析
- **AI 辅助**：未来可对接 skill-creator 自动提取

---

## 🎨 UI 设计说明

### 配色方案

```css
--primary-color: #1890ff;        /* 主色调 - 科技蓝 */
--success-color: #52c41a;        /* 成功 - 生态绿 */
--warning-color: #faad14;        /* 警告 - 活力橙 */
--error-color: #f5222d;          /* 错误 - 醒目红 */
--purple-color: #722ed1;         /* 紫色 - 深度感 */
--cyan-color: #13c2c2;           /* 青色 - 清新感 */
```

### 设计规范

- **圆角卡片**：所有卡片使用 8px 圆角，增加亲和力
- **渐变背景**：关键区域使用微妙的渐变色
- **悬停动效**：卡片悬停时轻微上浮 + 阴影加深
- **标签系统**：不同分类用不同颜色标签区分
- **留白充足**：模块之间保持足够间距，避免拥挤

---

## 🔐 安全与权限

### 当前配置（MVP 版本）

- ✅ 邀请制访问（不公开注册）
- ✅ 基础 CORS 保护
- ✅ SQL 注入防护（使用 SQLAlchemy ORM）

### 未来可扩展

- 🔲 钉钉 OAuth 登录（对接企业通讯录）
- 🔲 JWT Token 认证
- 🔲 角色权限管理（管理员/普通成员/访客）
- 🔲 操作日志审计

---

## 📈 数据迁移指南

### 从现有 Markdown 导入

系统已自动包含解析器，会将你现有的：

- `_prd-reflector/cases/*/retrospective.md` → `cases` 表
- `_prd-reflector/candidate-rules.md` → `rules` 表（status=candidate）
- `_prd-reflector/stable-rules.md` → `rules` 表（status=stable）
- `_prd-reflector/anti-patterns.md` → `anti_patterns` 表

### 导出回 Markdown

如果需要备份或迁移到其他系统：

```bash
# 访问导出接口
curl https://your-domain.railway.app/export/all -o backup.zip
```

会生成一个 ZIP 包，包含：
- `cases/*.md` - 所有案例
- `rules/candidate-rules.md` - 候选规则
- `rules/stable-rules.md` - 稳定规则
- `rules/anti-patterns.md` - 反模式

---

## 🚧 已知限制与待办

### MVP 版本限制

- ⚠️ 暂无评论功能（规则下方不能讨论）
- ⚠️ 暂无版本历史（规则修改不可追溯）
- ⚠️ 暂无冲突检测（矛盾规则不会提醒）
- ⚠️ 用户系统简化（仅基础信息）

### 路线图

| 版本 | 计划功能 | 预计时间 |
|------|---------|---------|
| v1.1 | 评论与讨论区 | 2026-Q2 |
| v1.2 | 规则版本历史 | 2026-Q2 |
| v1.3 | skill-creator 深度集成 | 2026-Q3 |
| v2.0 | 钉钉机器人通知 | 2026-Q3 |
| v2.0 | 规则冲突检测 | 2026-Q3 |

---

## 🤝 贡献指南

欢迎团队成员贡献代码！

### 开发流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature-name`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature-name`
5. 提交 Pull Request

### 代码规范

- **Python**: 遵循 PEP 8，使用 Black 格式化
- **JavaScript**: 使用 ESLint + Prettier
- **提交信息**: 使用语义化提交（feat:/fix:/docs:等前缀）

---

## 📝 FAQ

### Q: 部署后访问速度慢怎么办？

A: Railway 免费套餐在海外，国内访问可能较慢。解决方案：
- 使用 Cloudflare CDN 加速
- 升级到 Railway 付费套餐（$5/月）选择亚洲节点
- 或考虑部署到国内平台（如阿里云函数计算）

### Q: 数据会丢失吗？

A: Railway 的 PostgreSQL 数据库有自动备份，但建议定期手动导出：
- 每月访问一次 `/export/all` 下载备份
- 或在本地保留原始 Markdown 文件作为冷备份

### Q: 如何自定义 UI 配色？

A: 修改 `frontend/src/index.css` 中的 CSS 变量：
```css
:root {
  --primary-color: #你的颜色;
}
```
然后重新部署即可。

### Q: 能对接我们现有的 skill-creator 吗？

A: 可以！代码已预留接口：
- 在 `backend/main.py` 中添加 webhook 端点
- skill-creator 执行完成后 POST 到 `/api/auto-import`
- 系统自动解析并创建案例

---

## 📄 许可证

MIT License - 可自由使用、修改、分发

---

## 🙏 致谢

本项目灵感来源于 @Arkham 的 `自我学习 skill` 体系，特别是其四层知识架构和标准化规则格式。

感谢所有为 AI 协作效率提升做出贡献的团队！

---

## 📞 联系方式

- **项目负责人**: Arkham
- **技术支持**: 在项目中提 Issue 或直接联系开发者

---

**🎉 现在就去部署你的团队知识库吧！让每个人的经验都成为团队的财富！**
