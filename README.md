# System Design Playground

一个交互式的系统设计工具，用于可视化和分析系统架构。

## 功能特点

- **拖拽组件**: 从左侧面板拖拽组件到画布
- **可视化架构**: 使用 React Flow 创建和连接系统组件
- **架构分析**: 点击 "Analyze" 按钮分析架构问题
- **参考架构**: 点击 "Load Reference" 加载示例架构

## 支持的组件

- ⚖️ Load Balancer (LB)
- 🖥️ App Server (APP)
- 🗄️ Database (DB)
- ⚡ Cache (CACHE)

## 分析规则

1. **缺少数据库**: 如果没有数据库组件，会显示错误
2. **单点故障**: 如果只有一个数据库，会建议添加复制
3. **缺少缓存**: 如果没有缓存组件，会建议添加以提高读取性能
4. **缺少负载均衡**: 如果没有负载均衡器，会建议添加以提高可扩展性

## 技术栈

- React 19
- TypeScript
- Vite
- React Flow
- Zustand

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 使用方法

1. 从左侧面板拖拽组件到画布
2. 连接组件以建立关系
3. 点击 "Analyze" 按钮查看架构分析
4. 点击 "Load Reference" 加载示例架构
