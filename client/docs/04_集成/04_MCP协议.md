# MCP 协议

## 概述

MCP（Model Context Protocol）是 QooWork 支持的标准协议，允许 Agent 通过标准化接口连接外部工具和数据源。

## 架构

```
QooWork Main Process
├── src/main/mcp/
│   ├── MCP 服务器配置存储 (mcp_servers 表)
│   ├── MCP 运行时管理 (启动/停止/监控)
│   ├── MCP 启动解析 (Launch Resolution)
│   └── MCP 市场集成
│
└── OpenClaw 运行时
    └── MCP 客户端 (连接各 MCP Server)
```

## 数据模型

### mcp_servers 表

存储用户的 MCP 服务器配置：
- 服务器名称与描述
- 传输方式（stdio / SSE / HTTP）
- 启动命令与参数
- 环境变量
- 启用状态

### mcp_launch_resolutions 表

解析后的 MCP 服务器启动元数据：
- 可执行文件路径解析结果
- 运行时依赖（Node.js / Python 等）
- 平台适配信息

## MCP 传输方式

| 传输方式 | 适用场景 | 配置示例 |
|----------|----------|----------|
| stdio | 本地命令行工具 | `command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem"]` |
| SSE (Server-Sent Events) | 远程 HTTP 服务 | `url: "https://mcp-server.example.com/sse"` |
| HTTP | REST API 风格 | `url: "https://mcp-server.example.com"` |

## MCP 市场

QooWork 提供 MCP 服务器市场，支持：
- 浏览可用的 MCP 服务器
- 一键安装与配置
- 版本管理与更新

### 本地扩展

`openclaw-extensions/mcp-bridge/` 提供了 MCP 桥接插件，用于增强 OpenClaw 的 MCP 能力。

## 启动解析（Launch Resolution）

MCP 服务器启动时，QooWork 会进行启动解析：

1. 检测目标可执行文件是否可用（`npx`、`python`、`node` 等）
2. 解析命令路径（处理相对路径和平台差异）
3. 注入必要的环境变量（如认证 Token）
4. 生成启动元数据存入 `mcp_launch_resolutions` 表

## 生命周期

```
安装 → 配置 → 启动解析 → 运行 → 监控 → 停止/重启
```

- **安装**：通过市场或手动配置添加
- **启动**：应用启动或用户手动触发
- **监控**：检测进程状态，异常时自动重启
- **重载**：配置变更或 Agent 切换时重新加载

## 常见 MCP Server 示例

```json
{
  "name": "filesystem",
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
}
```

## 调试

### 查看 MCP 日志

MCP 服务器日志包含：
- 启动/停止事件
- 连接状态变更
- 工具调用请求与响应
- 错误信息

### 常见问题

**MCP 服务器无法启动**：
- 检查命令路径是否正确
- 检查环境变量是否完整
- 查看启动解析结果

**工具调用超时**：
- 检查 MCP 服务器进程是否正常运行
- 增加超时配置
- 检查网络连接（SSE/HTTP 模式）

## 相关文档

- 设计文档：`specs/features/mcp-launch-resolution/`、`specs/refactors/mcp-native-migration/`
- MCP 规范：<https://modelcontextprotocol.io/>
