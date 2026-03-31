# 🧪 本地测试报告

## ✅ 已完成步骤

### 1. 后端依赖安装
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
**状态**: ✅ 成功 (已安装 FastAPI, SQLAlchemy, Pydantic 等 20+ 依赖)

### 2. 前端依赖安装
```bash
cd frontend
npm install
```
**状态**: ✅ 成功 (已安装 194 个 npm 包)

### 3. 代码语法修复
- **问题**: `SubmitPage.jsx` 第 97 行 JSX 语法错误（引号嵌套）
- **修复**: 将双引号改为单引号
- **状态**: ✅ 已修复

---

## 🚀 启动服务

由于沙盒环境限制，请**在你的终端中执行以下命令**：

### 方案 A：使用一键启动脚本（推荐）

```bash
cd /Users/arkham/wukong/team-skill-knowledge-base
./start-local.sh
```

### 方案 B：手动启动（分两个终端）

**终端 1 - 后端服务：**
```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**终端 2 - 前端服务：**
```bash
cd /Users/arkham/wukong/team-skill-knowledge-base/frontend
npm run dev -- --host 0.0.0.0 --port 3000
```

---

## 📊 预期启动结果

### 后端服务 (FastAPI)
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```
- **API 地址**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs (Swagger UI)
- **数据库**: `/Users/arkham/wukong/team-skill-knowledge-base/data/app.db`

### 前端服务 (React)
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```
- **应用地址**: http://localhost:3000
- **热更新**: 支持 (修改代码自动刷新)

---

## 🧪 测试清单

启动后请按顺序测试以下功能：

### ✅ 后端 API 测试

访问 http://localhost:8000/docs 测试以下端点：

1. **GET /api/cases** - 获取案例列表
   - 预期：返回 1 个案例（PRD 质量改进案例）

2. **GET /api/rules** - 获取规则列表
   - 预期：返回 4 条规则

3. **GET /api/anti-patterns** - 获取反模式列表
   - 预期：返回 2 个反模式

4. **GET /api/stats** - 获取统计数据
   - 预期：返回汇总数据

5. **POST /api/import** - 重新导入 Markdown 数据
   - 预期：解析成功，返回导入数量

### ✅ 前端界面测试

访问 http://localhost:3000 测试以下页面：

1. **统计看板 (Dashboard)**
   - [ ] 显示总案例数、规则数、反模式数
   - [ ] 显示高频问题 TOP5
   - [ ] 显示规则分类分布图
   - [ ] 显示近期更新列表

2. **规则库 (RuleLibrary)**
   - [ ] 规则列表展示
   - [ ] 搜索功能（按标题/标签）
   - [ ] 筛选功能（按分类/状态）
   - [ ] 查看详情
   - [ ] 编辑规则
   - [ ] 删除规则

3. **案例库 (CaseLibrary)**
   - [ ] 案例卡片展示
   - [ ] 案例详情页
   - [ ] 关联规则显示
   - [ ] 一键采纳按钮

4. **提交分享 (SubmitPage)**
   - [ ] 表单填写
   - [ ] Markdown 预览
   - [ ] 提交成功提示

---

## 🎨 UI 验证要点

根据你的"活泼现代"要求，检查：

- [ ] 主色调为紫色渐变 (#667eea → #764ba2)
- [ ] 卡片圆角设计 (borderRadius: '12px')
- [ ] 按钮悬停效果 (hover 变色/阴影)
- [ ] 页面布局清晰，间距舒适
- [ ] 响应式设计（调整浏览器窗口大小测试）

---

## 🔧 常见问题排查

### 问题 1：端口被占用
```bash
# 查看占用端口的进程
lsof -i :8000
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题 2：前端构建失败
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 问题 3：后端数据库错误
```bash
cd backend
rm -f ../data/app.db
python3 main.py  # 重新初始化数据库
```

### 问题 4：API 跨域错误
检查 `backend/main.py` 中的 CORS 配置：
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📸 测试截图建议

测试时建议截图保存以下内容：

1. 统计看板整体效果
2. 规则库列表页
3. 规则详情页
4. 案例详情页
5. 提交表单页
6. Swagger API 文档页

---

## ✅ 测试完成后的下一步

测试通过后，你可以：

1. **调整 UI** - 告诉我需要修改的颜色/布局/文案
2. **添加功能** - 如需要新功能模块，随时提出
3. **云端部署** - 准备部署到 Railway.app
4. **团队邀请** - 配置私有访问，分享给团队成员

---

## 📞 需要帮助？

如果在测试过程中遇到任何问题：
- 截图错误信息
- 复制终端输出
- 描述具体现象

我会立即帮你解决！🚀
