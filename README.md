# qoowork

<p align="center">
  <strong>AI 办公平台 - 全场景桌面级 AI 助手</strong>
</p>

## 项目结构

```
qoowork/
├── client/          # 桌面客户端 (Electron + React + TypeScript)
├── cloud/           # 云端服务 (后端 API / 数据存储 / 协作同步)
├── ide-plugin/      # IDE 插件 (VS Code / JetBrains)
├── .github/         # CI/CD 工作流
└── package.json     # npm workspaces 根配置
```

## 快速开始

```bash
# 安装所有依赖
npm install

# 启动客户端 (开发模式)
npm run client:dev

# 构建客户端
npm run client:build

# 运行测试
npm run client:test
```

## 技术栈

| 模块 | 技术 |
|------|------|
| **客户端** | Electron 40, React 18, TypeScript 5, Vite 6, Tailwind CSS |
| **云端** | 待定 |
| **IDE 插件** | 待定 |

## 文档

- [客户端详细文档](client/README.md)
- [客户端中文文档](client/README_zh.md)
- [AGENTS.md](client/AGENTS.md) - AI Agent 开发指引
