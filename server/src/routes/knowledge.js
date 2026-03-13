/**
 * Knowledge Routes - 知识图谱API
 */

const express = require('express');
const router = express.Router();
const { KnowledgeGraph } = require('../../../src/knowledge/graph');
const { MemoryInheritance } = require('../../../src/knowledge/memory');

// 初始化服务
const knowledgeGraph = new KnowledgeGraph();
const memoryInheritance = new MemoryInheritance();

// 获取图谱统计
router.get('/stats', async (req, res, next) => {
  try {
    const entities = Array.from(knowledgeGraph.entities.values());
    const stats = {
      entityCount: entities.length,
      relationCount: knowledgeGraph.relations.length,
      entityTypes: [...new Set(entities.map(e => e.type))]
    };
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

// 获取所有实体
router.get('/entities', async (req, res, next) => {
  try {
    const { type, limit = 100, offset = 0 } = req.query;
    let entities = Array.from(knowledgeGraph.entities.values());
    
    if (type) {
      entities = entities.filter(e => e.type === type);
    }
    
    res.json({ 
      entities: entities.slice(offset, offset + parseInt(limit)),
      total: entities.length
    });
  } catch (error) {
    next(error);
  }
});

// 获取单个实体
router.get('/entities/:id', async (req, res, next) => {
  try {
    const entity = knowledgeGraph.entities.get(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    // 获取关联实体
    const context = knowledgeGraph.getContext(req.params.id);
    res.json({ entity, context });
  } catch (error) {
    next(error);
  }
});

// 创建实体
router.post('/entities', async (req, res, next) => {
  try {
    const { type, name, properties } = req.body;
    
    const entityId = knowledgeGraph.addEntity({
      type,
      name,
      properties: properties || {}
    });
    
    res.status(201).json({ entityId, message: 'Entity created' });
  } catch (error) {
    next(error);
  }
});

// 更新实体
router.put('/entities/:id', async (req, res, next) => {
  try {
    const entity = knowledgeGraph.entities.get(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    const { properties } = req.body;
    if (properties) {
      entity.properties = { ...entity.properties, ...properties };
      entity.updatedAt = new Date().toISOString();
    }
    
    res.json({ entity, message: 'Entity updated' });
  } catch (error) {
    next(error);
  }
});

// 删除实体
router.delete('/entities/:id', async (req, res, next) => {
  try {
    knowledgeGraph.entities.delete(req.params.id);
    res.json({ message: 'Entity deleted' });
  } catch (error) {
    next(error);
  }
});

// 查询实体
router.post('/query', async (req, res, next) => {
  try {
    const { pattern } = req.body;
    const results = knowledgeGraph.query(pattern);
    res.json({ results });
  } catch (error) {
    next(error);
  }
});

// 获取所有关系
router.get('/relations', async (req, res, next) => {
  try {
    res.json({ relations: knowledgeGraph.relations });
  } catch (error) {
    next(error);
  }
});

// 创建关系
router.post('/relations', async (req, res, next) => {
  try {
    const { from, to, type, properties } = req.body;
    
    knowledgeGraph.addRelation({
      from,
      to,
      type,
      properties: properties || {}
    });
    
    res.status(201).json({ message: 'Relation created' });
  } catch (error) {
    next(error);
  }
});

// ===== 记忆继承API =====

// 获取Agent记忆
router.get('/memory/:agentId', async (req, res, next) => {
  try {
    const { type, limit = 50 } = req.query;
    const memories = memoryInheritance.getRelevantMemories(req.params.agentId);
    
    let filtered = memories;
    if (type) {
      filtered = memories.filter(m => m.type === type);
    }
    
    res.json({ 
      memories: filtered.slice(0, parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
});

// 保存记忆
router.post('/memory/:agentId', async (req, res, next) => {
  try {
    const { content, type, importance, tags } = req.body;
    
    const memoryId = memoryInheritance.saveMemory(req.params.agentId, {
      content,
      type: type || 'general',
      importance: importance || 5,
      tags: tags || []
    });
    
    res.status(201).json({ memoryId, message: 'Memory saved' });
  } catch (error) {
    next(error);
  }
});

// 继承记忆
router.post('/memory/:toAgentId/inherit/:fromAgentId', async (req, res, next) => {
  try {
    const { types, maxItems } = req.body;
    
    const inheritance = memoryInheritance.inherit(
      req.params.fromAgentId,
      req.params.toAgentId,
      { types, maxItems }
    );
    
    res.json({ inheritance });
  } catch (error) {
    next(error);
  }
});

// 生成上下文
router.post('/memory/:agentId/context', async (req, res, next) => {
  try {
    const { template, data } = req.body;
    
    const context = memoryInheritance.generateContext(
      req.params.agentId,
      template,
      data
    );
    
    res.json({ context });
  } catch (error) {
    next(error);
  }
});

// 搜索记忆
router.get('/memory/search', async (req, res, next) => {
  try {
    const { q, agentId } = req.query;
    
    const results = memoryInheritance.search(q, agentId);
    res.json({ results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
