# qoowork IDE Plugin

qoowork IDE 插件 - 为 VSCode、JetBrains 等主流 IDE 提供智能编码辅助能力。

## 支持的 IDE

- VS Code (计划中)
- JetBrains (计划中)

## 目录结构（建议）

```
ide-plugin/
├── vscode/           # VS Code 插件
│   ├── src/
│   ├── package.json
│   └── README.md
├── jetbrains/        # JetBrains 插件
│   ├── src/
│   └── build.gradle
├── shared/           # 插件间共享代码
│   └── src/
└── README.md
```

## 开发

```bash
# VS Code 插件
cd ide-plugin/vscode
npm install
npm run dev

# JetBrains 插件
cd ide-plugin/jetbrains
./gradlew build
```
