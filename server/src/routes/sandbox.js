/**
 * Sandbox Routes - 安全沙箱API
 */

const express = require('express');
const router = express.Router();
const { SecuritySandbox } = require('../../../src/sandbox/security');

// 初始化服务
const sandbox = new SecuritySandbox();

// 获取审计日志
router.get('/audit', async (req, res, next) => {
  try {
    const { agentId, limit = 100 } = req.query;
    
    let logs = sandbox.auditLog;
    
    if (agentId) {
      logs = logs.filter(log => log.agentId === agentId);
    }
    
    res.json({ 
      logs: logs.slice(-parseInt(limit)).reverse() 
    });
  } catch (error) {
    next(error);
  }
});

// 执行沙箱操作
router.post('/execute', async (req, res, next) => {
  try {
    const { agentId, action, params, permissions } = req.body;
    
    // 临时设置权限
    const agent = { id: agentId, permissions: permissions || ['*'] };
    
    const result = await sandbox.execute(agent, action, params);
    
    res.json({ result, message: 'Action executed' });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// 检查权限
router.post('/check-permission', async (req, res, next) => {
  try {
    const { agentId, action } = req.body;
    
    const agent = { id: agentId, permissions: [] };
    const hasPermission = sandbox.hasPermission(agent, action);
    
    res.json({ hasPermission, agentId, action });
  } catch (error) {
    next(error);
  }
});

// 获取速率限制状态
router.get('/rate-limit/:agentId', async (req, res, next) => {
  try {
    const limit = sandbox.rateLimits.get(req.params.agentId);
    res.json({ 
      agentId: req.params.agentId,
      limit: limit || { count: 0, window: Date.now() }
    });
  } catch (error) {
    next(error);
  }
});

// 设置速率限制
router.post('/rate-limit', async (req, res, next) => {
  try {
    const { agentId, maxRequests, windowMs } = req.body;
    
    sandbox.rateLimits.set(agentId, { 
      count: 0, 
      window: Date.now(),
      maxRequests: maxRequests || 100,
      windowMs: windowMs || 60000
    });
    
    res.json({ message: 'Rate limit configured' });
  } catch (error) {
    next(error);
  }
});

// 获取Agent审计日志
router.get('/audit/:agentId', async (req, res, next) => {
  try {
    const logs = sandbox.getAuditLog(req.params.agentId);
    res.json({ logs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
