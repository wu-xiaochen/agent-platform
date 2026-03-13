/**
 * Workflow Routes - 工作流API
 */

const express = require('express');
const router = express.Router();
const { WorkflowEngine } = require('../../../src/orchestration/engine');

// 初始化工作流引擎
const workflowEngine = new WorkflowEngine();

// 获取所有工作流
router.get('/', async (req, res, next) => {
  try {
    const workflows = Array.from(workflowEngine.workflows.values());
    res.json({ workflows });
  } catch (error) {
    next(error);
  }
});

// 获取单个工作流
router.get('/:id', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ workflow });
  } catch (error) {
    next(error);
  }
});

// 创建工作流
router.post('/', async (req, res, next) => {
  try {
    const { name, type, steps, config } = req.body;
    
    const workflow = {
      id: `workflow_${Date.now()}`,
      name,
      type: type || 'sequential',
      steps: steps || [],
      config: config || {},
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    workflowEngine.workflows.set(workflow.id, workflow);
    
    res.status(201).json({ workflow, message: 'Workflow created' });
  } catch (error) {
    next(error);
  }
});

// 执行工作流
router.post('/:id/execute', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    // 更新状态
    workflow.status = 'running';
    workflow.startedAt = new Date().toISOString();
    
    // 执行工作流
    const results = await workflowEngine.execute(workflow);
    
    // 更新状态
    workflow.status = 'completed';
    workflow.completedAt = new Date().toISOString();
    workflow.results = results;
    
    res.json({ workflow, results });
  } catch (error) {
    // 标记失败
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (workflow) {
      workflow.status = 'failed';
      workflow.error = error.message;
    }
    next(error);
  }
});

// 暂停工作流
router.post('/:id/pause', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    workflow.status = 'paused';
    workflow.pausedAt = new Date().toISOString();
    
    res.json({ workflow, message: 'Workflow paused' });
  } catch (error) {
    next(error);
  }
});

// 恢复工作流
router.post('/:id/resume', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    workflow.status = 'running';
    workflow.resumedAt = new Date().toISOString();
    
    res.json({ workflow, message: 'Workflow resumed' });
  } catch (error) {
    next(error);
  }
});

// 停止工作流
router.post('/:id/stop', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    workflow.status = 'stopped';
    workflow.stoppedAt = new Date().toISOString();
    
    res.json({ workflow, message: 'Workflow stopped' });
  } catch (error) {
    next(error);
  }
});

// 更新工作流
router.put('/:id', async (req, res, next) => {
  try {
    const workflow = workflowEngine.workflows.get(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    const { name, type, steps, config } = req.body;
    
    if (name) workflow.name = name;
    if (type) workflow.type = type;
    if (steps) workflow.steps = steps;
    if (config) workflow.config = { ...workflow.config, ...config };
    workflow.updatedAt = new Date().toISOString();
    
    res.json({ workflow, message: 'Workflow updated' });
  } catch (error) {
    next(error);
  }
});

// 删除工作流
router.delete('/:id', async (req, res, next) => {
  try {
    workflowEngine.workflows.delete(req.params.id);
    res.json({ message: 'Workflow deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
