# AGENTS.md (根目录)

本文件为 qoowork 项目仓库级指引。

## 项目概述

qoowork 是一个 AI 办公平台，包含三个主要子系统：
- **client/** — 桌面客户端 (Electron + React + TypeScript)
- **cloud/** — 云端服务
- **ide-plugin/** — IDE 插件

## 子模块指引

各子模块有自己的 `AGENTS.md` 或 `README.md`：
- `client/AGENTS.md` — 客户端开发详细指引
- `cloud/README.md` — 云端服务开发指引
- `ide-plugin/README.md` — IDE 插件开发指引

## npm Workspaces

本项目使用 npm workspaces 管理多包依赖：
- 根目录 `npm install` 会安装所有子包依赖
- 各子包脚本通过 `npm run <script> --workspace=<package>` 调用

## 提交规范

使用 Conventional Commits 规范，通过 commitlint 强制检查。
