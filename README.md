# 🤖 垂直领域Agent + 编排平台

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/wu-xiaochen/agent-platform)](https://github.com/wu-xiaochen/agent-platform/stargazers)
[![License](https://img.shields.io/github/license/wu-xiaochen/agent-platform)](https://github.com/wu-xiaochen/agent-platform)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/wu-xiaochen/agent-platform)

**面向垂直领域的智能Agent编排平台**

</div>

---

## 📋 简介

本项目是一个完整的**垂直领域Agent + 编排平台**全栈解决方案，支持：

- 🤖 多Agent注册与协作
- 🔄 工作流编排（串行/并行/条件/循环）
- 📊 量化指标仪表盘
- 📚 知识图谱 + 记忆继承
- 🛡️ 安全沙箱与权限控制

---

## 🏗️ 技术架构

### 后端技术栈

| 技术 | 用途 |
|------|------|
| Node.js | 运行时 |
| Express | Web框架 |
| Helmet | 安全中间件 |
| CORS | 跨域支持 |

### 前端技术栈

| 技术 | 用途 |
|------|------|
| React 18 | UI框架 |
| React Router | 路由 |
| Zustand | 状态管理 |
| TanStack Query | 数据获取 |
| Recharts | 图表 |
| TailwindCSS | 样式 |

---

## 📁 项目结构

```
agent-platform/
├── client/                 # 前端React应用
│   ├── src/
│   │   ├── components/    # UI组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API服务
│   │   ├── stores/        # 状态管理
│   │   └── types/         # 类型定义
│   └── package.json
│
├── server/                 # 后端Express服务
│   └── src/
│       ├── controllers/   # 控制器
│       ├── routes/       # 路由
│       ├── middleware/   # 中间件
│       ├── models/        # 数据模型
│       └── services/     # 业务逻辑
│
├── src/                   # 核心库
│   ├── agents/           # Agent管理
│   ├── orchestration/     # 工作流引擎
│   ├── knowledge/        # 知识图谱
│   └── sandbox/          # 安全沙箱
│
├── shared/                # 共享类型定义
│   └── types.ts
│
└── README.md
```

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 9+

### 安装

```bash
# 克隆仓库
git clone https://github.com/wu-xiaochen/agent-platform.git
cd agent-platform

# 安装依赖
npm install
cd client && npm install && cd ..
```

### 运行

```bash
# 启动后端 (端口3000)
npm run server

# 启动前端 (端口5173)
npm run client

# 同时启动前后端
npm run dev
```

---

## 📡 API 文档

### Agent 管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/agents | 获取所有Agent |
| POST | /api/agents | 注册新Agent |
| GET | /api/agents/:id | 获取单个Agent |
| PUT | /api/agents/:id | 更新Agent |
| DELETE | /api/agents/:id | 删除Agent |
| POST | /api/agents/:id/role | 分配角色 |

### 工作流

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/workflows | 获取所有工作流 |
| POST | /api/workflows | 创建工作流 |
| POST | /api/workflows/:id/execute | 执行工作流 |
| POST | /api/workflows/:id/pause | 暂停工作流 |
| POST | /api/workflows/:id/resume | 恢复工作流 |

### 知识图谱

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/knowledge/entities | 获取实体列表 |
| POST | /api/knowledge/entities | 创建实体 |
| POST | /api/knowledge/query | 查询实体 |
| POST | /api/knowledge/relations | 创建关系 |
| GET | /api/knowledge/memory/:agentId | 获取记忆 |

### 指标

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/metrics | 获取仪表盘 |
| GET | /api/metrics/:agentId/score | 获取评分 |
| POST | /api/metrics | 记录指标 |
| GET | /api/metrics/alerts | 获取告警 |

---

## 🎯 核心功能

### 1. 多Agent编排引擎
- 支持串行/并行/条件分支/循环
- Agent角色定义（协调者/执行者/监控者等）
- 任务快照与断点续传

### 2. 知识图谱 + 记忆继承
- 实体与关系管理
- Agent上下文记忆
- 跨会话状态持久化

### 3. 量化指标仪表盘
- 成功率/效率/质量/可靠性评分
- 实时告警
- 历史趋势分析

### 4. 安全沙箱
- 权限控制
- 速率限制
- 审计日志

---

## 📊 测试结果

```
🚀 Initializing Agent Platform...
📚 Initializing Knowledge Graph...
✅ Knowledge Graph initialized
✅ Memory templates initialized
✅ Agent roles initialized
✅ Agent Platform ready!

🎭 Role test: { role: 'executor', permissions: [...] }
💾 Memory saved for agent agent_xxx
📊 Agent Score: { successRate: 1, efficiency: 1, overall: 0.75 }
✅ All tests passed!
```

---

## 📝 License

MIT License - 查看 [LICENSE](LICENSE) 了解详情

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<div align="center">

Made with ❤️ by [wu-xiaochen](https://github.com/wu-xiaochen)

</div>
