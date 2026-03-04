# CONTRIBUTING.md - 贡献指南

**项目:** Order Link  
**版本:** 1.0  
**创建时间:** 2026-03-04

---

## 📁 文件责任分区

为避免并发冲突，每位成员有明确负责的文件目录：

| 成员 | 角色 | 负责目录/文件 | 权限 |
|------|------|--------------|------|
| **@Assistant_pixel_v26_Bot** | UI/UX | `designs/`, `frontend/src/components/` | ✏️ 可修改 |
| **@Assistant_canvas_v26_Bot** | 前端 | `frontend/`, `package.json` (前端部分) | ✏️ 可修改 |
| **@Assistant_Backend_v26_Bot** | 后端 | `backend/`, `package.json` (后端部分) | ✏️ 可修改 |
| **@Assistant_Quality_v26_Bot** | QA | `tests/`, `docs/test-*.md` | ✏️ 可修改 |
| **@pqorderbot** | DevOps | `.github/`, `.gitignore`, `docs/deployment.md` | ✏️ 可修改 |
| **@MacAssistant_roadmap_V26_Bot** | PM | `STATE.yaml`, `GOALS.md`, `TEAM.md`, `README.md` | ✏️ 可修改 |

---

## 📋 共享文件修改规则

以下文件为**共享文件**，修改前需在群里沟通：

| 文件 | 说明 | 修改规则 |
|------|------|----------|
| `DECISIONS.md` | 决策记录 | 任何人可追加，不可删除 |
| `HEARTBEAT.md` | 定时任务 | Roadmap 修改，全员可见 |
| `docs/requirements.md` | 需求文档 | Roadmap + Boss 审批 |
| `docs/technical-design.md` | 技术方案 | 相关成员 + Roadmap 审批 |

---

## 🔄 Git 提交规范

### 提交前检查清单

```markdown
## Git 提交前检查

- [ ] git pull --rebase 获取最新代码
- [ ] 检查 git status 确认修改文件
- [ ] 确认修改的文件在自己负责范围内
- [ ] 如修改共享文件，已在群里确认
- [ ] 本地测试通过
- [ ] 提交信息清晰规范
```

### 提交信息格式

```
<type>(<scope>): <subject>

type: feat|fix|docs|style|refactor|test|chore
scope: frontend|backend|docs|design|devops|pm
subject: 简短描述

示例:
feat(backend): 添加订单抓取模块
fix(frontend): 修复映射弹窗样式
docs: 更新技术方案文档
```

---

## 🚀 推送流程

```bash
# 1. 获取最新代码
git pull --rebase origin master

# 2. 检查修改
git status

# 3. 提交
git add .
git commit -m "feat(scope): description"

# 4. 推送
git push origin master
```

### 如遇到冲突

```bash
# 解决冲突后
git add <resolved-files>
git commit -m "merge: resolve conflicts"
git push origin master
```

---

## ⚠️ 禁止行为

| 行为 | 原因 | 替代方案 |
|------|------|----------|
| 直接推送大文件 (>10MB) | 影响仓库大小 | 使用 Git LFS 或外部存储 |
| 修改他人负责的文件 | 可能导致冲突 | 先群里沟通，获得同意 |
| 跳过 git pull 直接推送 | 可能覆盖他人代码 | 推送前必须 pull |
| 在 master 分支直接合并 | 缺少审核 | 使用 PR + Review |

---

## 📢 沟通规则

### 修改共享文件前

在群里发送：
```
@MacAssistant_roadmap_V26_Bot 我计划修改 [文件名]，内容是 [简述]，有人同时修改吗？
```

### 完成修改后

在群里发送：
```
已完成 [文件名] 修改，已推送到远端。
```

---

## 🎯 分支策略（可选）

对于大功能开发：

```bash
# 创建功能分支
git checkout -b feature/your-feature

# 开发完成后提交 PR
# 至少 1 人 Review 后合并到 master
```

---

**最后更新:** 2026-03-04  
**维护:** Roadmap (PM)
