# OpenClaw 集成指南

## 概述

QooWork 基于 [OpenClaw](https://github.com/openclaw/openclaw) 作为唯一的 AI Agent 运行时与网关。Cowork 层负责用户交互与状态管理，OpenClaw 负责模型调度、工具执行、渠道集成。

> **历史遗留**：项目中 `yd_cowork` 已完全移除，不要重新引入或围绕它设计。文档中的 `cowork:*` IPC 通道、`claude_session_id` 等命名是兼容历史命名，不代表存在另一个活跃运行时。

## 架构关系

```
QooWork (Electron App)
├── Main 进程
│   ├── openclawEngineManager.ts    ← 网关进程生命周期
│   ├── openclawConfigSync.ts       ← 配置生成与同步
│   └── openclawRuntimeAdapter.ts   ← 事件转换
│
└── OpenClaw 运行时 (子进程)
    ├── 网关进程 (HTTP + WS)
    ├── Agent 会话管理
    ├── 工具执行 (文件/Shell/浏览器)
    ├── IM 渠道连接器
    └── 定时任务调度
```

## 关键模块

### openclawEngineManager

位置：`src/main/libs/openclawEngineManager.ts`

职责：
- 启动/停止/重启 OpenClaw 网关子进程
- 管理运行时状态目录、配置路径、端口分配
- 生成与分发认证 Token
- 捕获并写入网关日志
- 运行时就绪检测与修复

### openclawConfigSync

位置：`src/main/libs/openclawConfigSync.ts`

职责：
- 将 QooWork 状态渲染为 OpenClaw 配置格式
- 同步 Models/Providers、Agents、IM 绑定、Plugins
- 同步 MCP 服务器配置、Skills 扩展目录
- 管理沙箱模式与 `AGENTS.md` 工作区区段

### openclawRuntimeAdapter

位置：`src/main/libs/agentEngine/openclawRuntimeAdapter.ts`

职责：
- 监听 OpenClaw 网关的 SSE/WebSocket 事件流
- 将 OpenClaw 事件转换为 Cowork 标准的流事件格式
- 处理会话状态、消息块、工具调用/结果、权限请求等

### coworkEngineRouter

位置：`src/main/libs/agentEngine/coworkEngineRouter.ts`

职责：
- Cowork 层统一运行时路由入口
- 当前仅路由到 OpenClaw（`CoworkAgentEngine = 'openclaw'`）

## 配置文件位置

OpenClaw 运行时状态位于 Electron `userData/openclaw/`：

| 路径 | 说明 |
|------|------|
| `state/openclaw.json` | 主配置文件（由 `openclawConfigSync` 生成） |
| `state/workspace-main/` | 主 Agent 工作区 |
| `state/workspace-{agentId}/` | 非主 Agent 工作区 |
| `logs/gateway-YYYY-MM-DD.log` | 网关日志 |

## 工作区文件

每个 Agent 工作区包含：

| 文件 | 用途 |
|------|------|
| `AGENTS.md` | 工作区指令（含 QooWork 管理区段） |
| `MEMORY.md` | 持久化记忆 |
| `memory/YYYY-MM-DD.md` | 每日笔记 |
| `USER.md` | 用户画像 |
| `SOUL.md` | Agent 系统提示词 |
| `IDENTITY.md` | Agent 身份定义 |

## 补丁策略

### 原则

1. **优先 QooWork 侧**：尽量通过适配器、配置同步、插件配置或 UI 处理实现需求
2. **补丁为最后手段**：仅当行为必须在 OpenClaw 内部修改且无法通过 QooWork 侧实现时使用
3. **版本绑定**：补丁与 OpenClaw 版本严格绑定

### 补丁管理

```
scripts/patches/<openclaw.version>/
```

补丁由 `npm run openclaw:patch`（调用 `scripts/apply-openclaw-patches.cjs`）自动应用。

新增补丁流程：
1. 在 `scripts/patches/<version>/` 下创建 `.patch` 文件
2. 补丁文件包含清晰的注释说明原因
3. 升级 OpenClaw 版本时重新评估所有补丁是否仍需保留

### 禁止行为

- 不要直接在 OpenClaw 源码树中手动修改而不生成补丁
- 不要将 `vendor/openclaw-runtime/` 提交到 Git

## 调试

### 查看网关日志

```
# Windows
%APPDATA%/qoowork/openclaw/logs/gateway-YYYY-MM-DD.log

# macOS
~/Library/Application Support/qoowork/openclaw/logs/gateway-YYYY-MM-DD.log

# Linux
~/.config/qoowork/openclaw/logs/gateway-YYYY-MM-DD.log
```

### 重启网关

在应用中切换模型或配置后，OpenClaw 网关会自动重启。也可通过 `openclawEngineManager` 手动触发。

### 常见问题

**网关启动失败**：
- 检查 Node.js 版本是否满足 `>= 24.15.0`
- 检查 `vendor/openclaw-runtime/current` 是否正确指向
- 查看网关日志中的错误信息

**配置同步异常**：
- 检查 `openclaw.json` 文件内容是否正确生成
- 检查 Agents/Models 配置在 QooWork UI 中是否正确

**IM 渠道断开**：
- 检查对应插件版本是否匹配
- 查看网关日志中的渠道连接状态
