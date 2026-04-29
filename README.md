# System Design Playground

一个交互式的系统设计工具，用于可视化和分析系统架构。

## 功能特点

### v1 功能
- **拖拽组件**: 从左侧面板拖拽组件到画布
- **可视化架构**: 使用 React Flow 创建和连接系统组件
- **架构分析**: 点击 "Analyze" 按钮分析架构问题
- **参考架构**: 点击 "Load Reference" 加载示例架构

### v2 新增功能
- **流量模拟**: 输入 QPS 值模拟真实流量
- **瓶颈检测**: 自动识别系统瓶颈节点
- **负载分析**: 显示各节点的负载情况
- **可视化反馈**: 节点颜色表示负载状态（绿色正常、黄色警告、红色过载）

### v3 新增功能
- **组件图标**: 使用 SVG 图标替代 emoji，更专业美观
- **删除功能**: 悬停节点显示删除按钮，支持删除画板组件
- **中英文切换**: 支持中文和英文界面切换

## 支持的组件

- 🔄 Load Balancer (LB) - 容量: 100,000 QPS
- 🖥️ App Server (APP) - 容量: 10,000 QPS
- 🗄️ Database (DB) - 容量: 5,000 QPS
- ⚡ Cache (CACHE) - 容量: 50,000 QPS

## 分析规则

### 基础分析
1. **缺少数据库**: 如果没有数据库组件，会显示错误
2. **单点故障**: 如果只有一个数据库，会建议添加复制
3. **缺少缓存**: 如果没有缓存组件，会建议添加以提高读取性能
4. **缺少负载均衡**: 如果没有负载均衡器，会建议添加以提高可扩展性

### 流量分析
- **缓存命中**: 如果有缓存，假设 70% 缓存命中率，减少数据库负载
- **瓶颈检测**: 当节点负载超过容量时，标记为瓶颈
- **负载分布**: 显示各节点的实际负载和容量百分比

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
3. 悬停节点显示删除按钮，点击可删除节点
4. 点击 "Analyze" 按钮查看基础架构分析
5. 输入 QPS 值并点击 "Simulate" 进行流量模拟
6. 查看节点颜色变化和负载分析结果
7. 点击 "Load Reference" 加载示例架构
8. 使用右上角语言切换按钮切换中英文

## 项目结构

```
src/
├── components/
│   ├── Canvas.tsx           # React Flow 画布
│   ├── ComponentPalette.tsx # 组件面板
│   ├── AnalysisPanel.tsx    # 分析面板
│   ├── CustomNode.tsx       # 自定义节点组件
│   ├── LanguageSwitcher.tsx # 语言切换组件
│   └── icons/               # SVG 图标组件
├── store/
│   └── useStore.ts          # Zustand 状态管理
├── logic/
│   ├── rules.ts             # 架构分析规则
│   ├── capacity.ts          # 节点容量模型
│   └── traffic.ts           # 流量计算工具
├── i18n/
│   ├── locales.ts           # 语言配置
│   └── useI18n.ts           # 国际化 Hook
├── styles/
│   └── layout.css           # 布局样式
├── App.tsx                  # 主应用组件
└── main.tsx                 # 入口文件
```
