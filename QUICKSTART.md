# 🚀 快速启动指南

## 方案 A：本地开发测试（推荐先试这个）

### 1. 启动后端

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/backend

# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn main:app --reload --port 8000
```

访问：http://localhost:8000/docs 查看 API 文档

### 2. 导入你的现有数据

在浏览器中访问：
```
POST http://localhost:8000/api/import-markdown
```

或者直接用解析器：
```bash
cd /Users/arkham/wukong/team-skill-knowledge-base
python3 backend/parser.py
```

### 3. 启动前端

打开新终端：
```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：http://localhost:3000

---

## 方案 B：一键部署到 Railway（生产环境）

### 前置准备

1. 注册 Railway 账号：https://railway.app
2. 安装 Railway CLI：
   ```bash
   npm install -g @railway/cli
   ```

### 部署步骤

**Step 1: 初始化项目**
```bash
cd /Users/arkham/wukong/team-skill-knowledge-base
railway login
railway init
```

**Step 2: 创建服务**
```bash
# Railway 会自动识别 railway.json 并部署
railway up
```

**Step 3: 设置环境变量**
```bash
railway vars set DATABASE_URL=sqlite:///./team_skills.db
railway vars set ADMIN_PASSWORD=你的管理员密码
```

**Step 4: 获取部署地址**
```bash
railway domain
# 会返回类似：https://your-project.railway.app
```

### 配置私有访问

在 Railway 控制台设置：
1. 开启 **Authentication**
2. 设置邀请码：`TEAM_ONLY_ACCESS`
3. 关闭公开注册

---

## 📊 数据导入验证

导入成功后，访问前端页面应该能看到：

- **统计看板**：显示 1 个案例、4 条规则、2 个反模式
- **规则库**：展示你现有的 4 条规则
- **案例库**：展示"PRD 质量改进"案例
- **提交分享**：可以上传新的经验总结

---

## 🔧 常见问题

### Q: 前端页面空白？
A: 确保后端已在 8000 端口启动，前端代理配置正确

### Q: 数据导入失败？
A: 检查 Markdown 文件路径是否正确，运行 `python3 backend/parser.py` 测试

### Q: Railway 部署超时？
A: 首次构建需要 5-10 分钟，查看 Build Log 确认进度

### Q: 如何添加团队成员？
A: 在 Railway 控制台 → Settings → Sharing → 邀请邮箱

---

## 📞 需要帮助？

查看完整文档：`README.md`
API 文档：http://localhost:8000/docs
