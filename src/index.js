/**
 * Agent Platform - Main Entry
 * 垂直领域Agent + 编排平台
 * 
 * 功能对齐：
 * - CEO: 垂直领域Agent + 编排平台
 * - PM: 任务快照+断点续传、Agent角色定义、量化指标、记忆继承
 */

const { AgentRegistry } = require('./agents/registry');
const { AgentRoleManager, AgentRole } = require('./agents/roles');
const { TaskSnapshot } = require('./agents/snapshot');
const { WorkflowEngine } = require('./orchestration/engine');
const { MetricsDashboard } = require('./orchestration/metrics');
const { KnowledgeGraph } = require('./knowledge/graph');
const { MemoryInheritance } = require('./knowledge/memory');
const { SecuritySandbox } = require('./sandbox/security');

class AgentPlatform {
  constructor() {
    // 核心组件
    this.registry = new AgentRegistry();
    this.workflow = new WorkflowEngine();
    this.knowledge = new KnowledgeGraph();
    this.sandbox = new SecuritySandbox();
    
    // PM需求功能
    this.snapshot = new TaskSnapshot();           // 任务快照+断点续传
    this.roles = new AgentRoleManager();          // Agent角色定义
    this.metrics = new MetricsDashboard();        // 量化指标仪表盘
    this.memory = new MemoryInheritance();         // 记忆继承
    
    this.initialized = false;
  }

  async initialize() {
    console.log('🚀 Initializing Agent Platform...');
    
    // 初始化知识图谱
    await this.knowledge.initialize();
    console.log('✅ Knowledge Graph initialized');
    
    // 初始化记忆继承模板
    this.initializeMemoryTemplates();
    console.log('✅ Memory templates initialized');
    
    // 初始化角色定义
    this.initializeRoles();
    console.log('✅ Agent roles initialized');
    
    this.initialized = true;
    console.log('✅ Agent Platform ready!\n');
  }

  initializeMemoryTemplates() {
    // 创建常用的上下文模板
    this.memory.createTemplate('task_context', {
      keywords: ['task', 'goal', 'objective'],
      context: '当前任务：{{taskName}}\n目标：{{goal}}\n约束：{{constraints}}'
    });

    this.memory.createTemplate('project_context', {
      keywords: ['project', 'timeline', 'milestone'],
      context: '项目：{{projectName}}\n当前阶段：{{phase}}\n里程碑：{{milestone}}'
    });
  }

  initializeRoles() {
    // 预设一些常用角色
    const coordinatorId = this.registry.register({
      name: 'Coordinator',
      type: 'coordinator',
      capabilities: ['task_assignment', 'agent_coordination']
    });
    
    this.roles.assignRole(coordinatorId, AgentRole.COORDINATOR);

    const executorId = this.registry.register({
      name: 'Executor',
      type: 'executor', 
      capabilities: ['task_execution', 'tool_invocation']
    });
    
    this.roles.assignRole(executorId, AgentRole.EXECUTOR);
  }

  // 注册Agent并分配角色
  async registerAgent(agent, role = null) {
    const agentId = await this.registry.register(agent);
    
    if (role) {
      this.roles.assignRole(agentId, role);
    }
    
    return agentId;
  }

  // 创建任务快照
  createTaskSnapshot(taskId, state) {
    return this.snapshot.createSnapshot(taskId, state);
  }

  // 从快照恢复任务
  restoreTask(taskId) {
    return this.snapshot.restore(taskId);
  }

  // 执行工作流
  async executeWorkflow(workflow) {
    const result = await this.workflow.execute(workflow);
    
    // 记录指标
    this.metrics.record({
      agentId: workflow.agentId || 'system',
      name: 'workflow_completed',
      value: 1
    });
    
    return result;
  }

  // 记录指标
  recordMetric(agentId, metricName, value) {
    this.metrics.record({ agentId, name: metricName, value });
  }

  // 获取Agent评分
  getAgentScore(agentId) {
    return this.metrics.getScore(agentId);
  }

  // 获取仪表盘
  getDashboard(agentId = null) {
    return this.metrics.getDashboard(agentId);
  }

  // 保存记忆
  saveMemory(agentId, content, options = {}) {
    return this.memory.saveMemory(agentId, { content, ...options });
  }

  // 继承记忆
  inheritMemory(fromAgentId, toAgentId, options = {}) {
    return this.memory.inherit(fromAgentId, toAgentId, options);
  }

  // 生成上下文
  generateContext(agentId, templateName, data = {}) {
    return this.memory.generateContext(agentId, templateName, data);
  }
}

// 导出并测试
module.exports = { AgentPlatform };

// 如果直接运行，执行测试
if (require.main === module) {
  (async () => {
    const platform = new AgentPlatform();
    await platform.initialize();
    
    // 测试注册Agent
    const agentId = await platform.registerAgent({
      name: 'TestAgent',
      capabilities: ['chat', 'search']
    }, AgentRole.EXECUTOR);
    
    // 测试角色
    console.log('\n🎭 Role test:', platform.roles.getRole(agentId));
    
    // 测试记忆
    platform.saveMemory(agentId, '用户喜欢简洁的报告', { 
      type: 'preference', 
      importance: 8,
      tags: ['user_preference', 'reporting']
    });
    
    // 测试指标
    platform.recordMetric(agentId, 'task_completed', 1);
    platform.recordMetric(agentId, 'task_completed', 1);
    platform.recordMetric(agentId, 'execution_time', 45000);
    
    // 获取评分
    console.log('\n📊 Agent Score:', platform.getAgentScore(agentId));
    
    // 获取仪表盘
    console.log('\n📈 Dashboard:', platform.getDashboard(agentId));
    
    console.log('\n✅ All tests passed!');
  })();
}
