/**
 * Agent Platform - Main Entry
 * 垂直领域Agent + 编排平台
 */

const { AgentRegistry } = require('./agents/registry');
const { WorkflowEngine } = require('./orchestration/engine');
const { KnowledgeGraph } = require('./knowledge/graph');
const { SecuritySandbox } = require('./sandbox/security');

class AgentPlatform {
  constructor() {
    this.registry = new AgentRegistry();
    this.workflow = new WorkflowEngine();
    this.knowledge = new KnowledgeGraph();
    this.sandbox = new SecuritySandbox();
  }

  async initialize() {
    console.log('🚀 Initializing Agent Platform...');
    await this.knowledge.initialize();
    console.log('✅ Knowledge Graph initialized');
  }

  async registerAgent(agent) {
    return await this.registry.register(agent);
  }

  async executeWorkflow(workflow) {
    return await this.workflow.execute(workflow);
  }
}

module.exports = { AgentPlatform };
