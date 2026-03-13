/**
 * Agent Platform API - Express Server
 * 垂直领域Agent + 编排平台 - 后端服务
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const agentRoutes = require('./routes/agents');
const workflowRoutes = require('./routes/workflows');
const knowledgeRoutes = require('./routes/knowledge');
const metricsRoutes = require('./routes/metrics');
const sandboxRoutes = require('./routes/sandbox');

const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

class APIServer {
  constructor(config = {}) {
    this.app = express();
    this.port = config.port || 3000;
    this.env = config.env || 'development';
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // 安全中间件
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }));
    
    // 压缩
    this.app.use(compression());
    
    // 请求解析
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // 请求日志
    this.app.use(requestLogger);
  }

  setupRoutes() {
    // 健康检查
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API路由
    this.app.use('/api/agents', agentRoutes);
    this.app.use('/api/workflows', workflowRoutes);
    this.app.use('/api/knowledge', knowledgeRoutes);
    this.app.use('/api/metrics', metricsRoutes);
    this.app.use('/api/sandbox', sandboxRoutes);

    // 404处理
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 API Server running on port ${this.port}`);
        console.log(`📝 Environment: ${this.env}`);
        resolve();
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 API Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// 启动服务器
if (require.main === module) {
  const server = new APIServer({
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  });
  
  server.start().catch(console.error);
}

module.exports = { APIServer };
