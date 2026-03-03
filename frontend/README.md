# Frontend - 订单转换助手

## 技术栈

- **框架:** React + TypeScript
- **构建:** Vite
- **UI:** Ant Design / Chakra UI
- **状态管理:** Zustand
- **运行环境:** Electron

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 目录结构

```
frontend/
├── src/
│   ├── components/    # 可复用组件
│   ├── pages/         # 页面组件
│   ├── stores/        # 状态管理
│   ├── services/      # API 调用
│   └── App.tsx
└── package.json
```

## 主要页面

1. **Workbench** - 主工作区（订单列表 + 映射）
2. **Mapping** - 映射规则配置
3. **Automation** - 自动化任务管理
4. **History** - 操作历史
5. **Settings** - 系统设置

## UI 设计规范

参考 UI 示例图，核心要点：
- 深色模式
- 双栏布局（外部订单 | 内部订单）
- 状态标识（✅ Perfect Match / ⚠️ Review / ❌ Error）
- 弹窗式映射编辑器
