# qoowork Cloud

qoowork 云端服务 - 为 AI 办公平台提供后端 API、数据存储、协作同步等云端能力。

## 技术栈

待定（建议：Node.js + TypeScript + 数据库）

## 目录结构（建议）

```
cloud/
├── src/
│   ├── api/          # REST API 路由
│   ├── services/     # 业务逻辑层
│   ├── models/       # 数据模型
│   ├── middleware/   # 中间件
│   └── utils/        # 工具函数
├── config/           # 配置文件
├── scripts/          # 部署/运维脚本
├── tests/            # 测试
├── package.json
└── tsconfig.json
```

## 开发

```bash
# 在根目录
npm run cloud:dev

# 或在 cloud/ 目录
cd cloud
npm install
npm run dev
```
