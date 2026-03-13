/**
 * Agent Routes - Agent管理API
 */

const express = require('express');
const router = express.Router();
const { AgentRegistry } = require('../../../src/agents/registry');
const { AgentRoleManager, AgentRole } = require('../../../src/agents/roles');
const { TaskSnapshot } = require('../../../src/agents/snapshot');

// 初始化服务
const registry = new AgentRegistry();
const roleManager = new AgentRoleManager();
const snapshot = new TaskSnapshot();

// 获取所有Agent
router.get('/', async (req, res, next) => {
  try {
    const agents = registry.list();
    res.json({ agents });
  } catch (error) {
    next(error);
  }
});

// 获取单个Agent
router.get('/:id', async (req, res, next) => {
  try {
    const agent = registry.get(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ agent });
  } catch (error) {
    next(error);
  }
});

// 注册Agent
router.post('/', async (req, res, next) => {
  try {
    const { name, capabilities, role, metadata } = req.body;
    
    const agentId = await registry.register({
      name,
      capabilities: capabilities || [],
      metadata: metadata || {}
    });
    
    // 分配角色
    if (role) {
      roleManager.assignRole(agentId, role);
    }
    
    res.status(201).json({ 
      agentId, 
      message: 'Agent registered successfully' 
    });
  } catch (error) {
    next(error);
  }
});

// 更新Agent
router.put('/:id', async (req, res, next) => {
  try {
    const { name, capabilities, metadata } = req.body;
    const agent = registry.get(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // 更新字段
    if (name) agent.name = name;
    if (capabilities) agent.capabilities = capabilities;
    if (metadata) agent.metadata = { ...agent.metadata, ...metadata };
    agent.updatedAt = new Date().toISOString();
    
    res.json({ agent, message: 'Agent updated successfully' });
  } catch (error) {
    next(error);
  }
});

// 删除Agent
router.delete('/:id', async (req, res, next) => {
  try {
    // 这里应该实现删除逻辑
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// 分配角色
router.post('/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    roleManager.assignRole(req.params.id, role);
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    next(error);
  }
});

// 获取角色
router.get('/:id/role', async (req, res, next) => {
  try {
    const role = roleManager.getRole(req.params.id);
    res.json({ role });
  } catch (error) {
    next(error);
  }
});

// 创建任务快照
router.post('/:id/snapshots', async (req, res, next) => {
  try {
    const { state } = req.body;
    const snap = snapshot.createSnapshot(req.params.id, state);
    res.status(201).json({ snapshot: snap });
  } catch (error) {
    next(error);
  }
});

// 恢复任务
router.post('/:id/snapshots/:snapshotId/restore', async (req, res, next) => {
  try {
    const restored = snapshot.restore(req.params.snapshotId);
    res.json({ restored });
  } catch (error) {
    next(error);
  }
});

// 查询Agent
router.get('/search/find', async (req, res, next) => {
  try {
    const { capabilities, role } = req.query;
    const criteria = {};
    
    if (capabilities) {
      criteria.capabilities = { $in: capabilities.split(',') };
    }
    
    const agents = await registry.find(criteria);
    res.json({ agents });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
