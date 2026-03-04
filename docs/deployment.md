# 部署方案 - Order Link

**版本:** 1.0  
**日期:** 2026-03-03  
**负责人:** @pqorderbot (DevOps)

---

## 1. 部署目标

| 平台 | 目标格式 | 分发方式 |
|------|----------|----------|
| **Windows** | `.exe` 安装包 / `.portable.exe` | 内部下载 |
| **macOS** | `.dmg` / `.app` | 内部下载 |
| **Linux** | `.AppImage` / `.deb` | 内部下载 |

---

## 2. 技术选型

### 2.1 打包工具

```
electron-builder
├── 跨平台打包支持
├── 代码签名集成
├── 自动更新支持
└── 灵活的配置文件
```

### 2.2 自动更新（可选）

```
electron-updater
├── GitHub Releases 分发
├── 私有 S3 存储桶
└── 手动检查更新
```

---

## 3. 目录结构

```
order_link/
├── frontend/                 # React + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js + Express
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── electron/                 # Electron 主进程
│   ├── main.ts
│   ├── preload.ts
│   └── package.json
│
├── build/                    # 打包输出
│   ├── win-unpacked/
│   ├── mac/
│   └── linux-unpacked/
│
├── release/                  # 发布安装包
│   ├── Order-Link-Setup-1.0.0.exe
│   ├── Order-Link-1.0.0.dmg
│   └── Order-Link-1.0.0.AppImage
│
└── electron-builder.yml      # 打包配置
```

---

## 4. 打包配置

### 4.1 electron-builder.yml

```yaml
appId: com.orderpairs.orderlink
productName: Order Link
copyright: Copyright © 2026 OrderPairs

directories:
  output: release
  buildResources: build

files:
  - from: dist
    to: app
  - filter:
      - '**/*'
      - '!**/*.map'

win:
  target:
    - target: nsis
      arch:
        - x64
        - arm64
  artifactName: ${productName}-Setup-${version}.${ext}

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true

mac:
  target:
    - dmg
    - zip
  artifactName: ${productName}-${version}.${ext}
  category: public.app-category.business

linux:
  target:
    - AppImage
    - deb
  artifactName: ${productName}-${version}.${ext}
  category: Office

publish:
  provider: github
  owner: orderpairs-ship-it
  repo: order_link
  private: true
```

### 4.2 构建脚本 (package.json)

```json
{
  "scripts": {
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "build:electron": "tsc -p electron",
    "build:all": "npm run build:frontend && npm run build:backend && npm run build:electron",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win",
    "dist:mac": "electron-builder --mac",
    "dist:linux": "electron-builder --linux",
    "release": "npm run build:all && npm run dist"
  }
}
```

---

## 5. 代码签名

### 5.1 Windows (可选)

```bash
# 需要购买代码签名证书
export WIN_CSC_LINK="./certs/windows-cert.pfx"
export WIN_CSC_KEY_PASSWORD="your-password"
```

### 5.2 macOS (可选)

```bash
# 需要 Apple Developer 账号
export CSC_NAME="Developer ID Application: Your Company"
export APPLE_ID="your@apple.id"
export APPLE_APP_SPECIFIC_PASSWORD="your-app-specific-password"
export APPLE_TEAM_ID="your-team-id"
```

### 5.3 Linux

无需签名

---

## 6. 自动更新配置

### 6.1 启用自动更新

```typescript
// electron/main.ts
import { autoUpdater } from 'electron-updater'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

autoUpdater.on('update-available', (info) => {
  // 通知用户有新版本
})

autoUpdater.on('update-downloaded', (info) => {
  // 提示用户重启安装
})

// 检查更新
export function checkForUpdates() {
  autoUpdater.checkForUpdates()
}

// 下载并安装
export function downloadUpdate() {
  autoUpdater.downloadUpdate()
}
```

### 6.2 私有仓库发布

```yaml
# electron-builder.yml
publish:
  provider: github
  owner: orderpairs-ship-it
  repo: order_link
  private: true
  token: ${GH_TOKEN}  # 需要 GitHub Token
```

---

## 7. 分发渠道

### 7.1 内部下载（推荐）

```
GitHub Releases (Private Repo)
├── 团队成员通过 GitHub 下载
├── 版本历史清晰
└── 支持自动更新
```

### 7.2 私有 S3 存储桶

```
AWS S3 / 阿里云 OSS
├── 自定义下载页面
├── CDN 加速
└── 访问控制
```

### 7.3 企业应用商店（可选）

```
Microsoft Store for Business
Apple Business Manager
```

---

## 8. CI/CD 集成

### 8.1 GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:all
      
      - name: Build Release
        run: npm run dist
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Release
        uses: softprops/action-gh-release@v1
        with:
          files: release/*
```

---

## 9. 发布流程

### 9.1 版本发布清单

```bash
# 1. 更新版本号
npm version 1.0.0

# 2. 打标签
git tag v1.0.0
git push origin v1.0.0

# 3. 触发 CI/CD
# GitHub Actions 自动构建并发布

# 4. 验证发布
# - 下载各平台安装包
# - 测试安装流程
# - 测试自动更新
```

### 9.2 发布检查清单

- [ ] 所有测试通过
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] Git tag 已推送
- [ ] GitHub Release 已创建
- [ ] 各平台安装包测试通过
- [ ] 自动更新测试通过

---

## 10. 故障排除

### 10.1 常见问题

| 问题 | 解决方案 |
|------|----------|
| 打包后应用无法启动 | 检查 main.ts 入口路径 |
| 自动更新失败 | 检查 GH_TOKEN 权限 |
| macOS 签名失败 | 检查 Apple Developer 配置 |
| Windows 安装包过大 | 启用代码压缩，排除 sourcemap |

### 10.2 日志位置

```
Windows: %APPDATA%\Order Link\logs\
macOS: ~/Library/Logs/Order Link/
Linux: ~/.config/Order Link/logs/
```

---

## 11. 维护计划

| 任务 | 频率 | 负责人 |
|------|------|--------|
| 安全更新 | 每月 | DevOps |
| 依赖升级 | 每季度 | DevOps |
| 版本发布 | 按需 | DevOps + PM |
| 用户反馈处理 | 持续 | QA + DevOps |

---

**文档维护者:** @pqorderbot  
**最后更新:** 2026-03-03
