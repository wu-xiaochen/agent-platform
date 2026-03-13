/**
 * Agent Roles - Agent角色定义
 * 解决：多Agent协作时职责不清问题
 */

const AgentRole = {
  COORDINATOR: 'coordinator',      // 协调者：负责分配任务
  EXECUTOR: 'executor',            // 执行者：负责具体任务
  MONITOR: 'monitor',             // 监控者：负责质量控制
  ORCHESTRATOR: 'orchestrator',   // 编排者：负责工作流
  ANALYZER: 'analyzer',           // 分析者：负责数据分析
  PLANNER: 'planner'              // 规划者：负责制定计划
};

const RolePermissions = {
  [AgentRole.COORDINATOR]: ['task:assign', 'task:review', 'agent:list'],
  [AgentRole.EXECUTOR]: ['task:execute', 'tool:call', 'context:read'],
  [AgentRole.MONITOR]: ['task:inspect', 'metrics:read', 'alert:create'],
  [AgentRole.ORCHESTRATOR]: ['workflow:create', 'workflow:execute', 'agent:invoke'],
  [AgentRole.ANALYZER]: ['data:read', 'data:analyze', 'report:generate'],
  [AgentRole.PLANNER]: ['plan:create', 'plan:evaluate', 'priority:set']
};

class AgentRoleManager {
  constructor() {
    this.roleAssignments = new Map();
    this.roleDefinitions = new Map();
    this.initializeRoles();
  }

  initializeRoles() {
    // 定义各角色的职责和能力
    this.roleDefinitions.set(AgentRole.COORDINATOR, {
      name: '协调者',
      description: '负责分配任务给其他Agent，监控整体进度',
      capabilities: ['task_assignment', 'progress_tracking', 'conflict_resolution'],
      maxAgents: 10,
      color: '#4A90E2'
    });

    this.roleDefinitions.set(AgentRole.EXECUTOR, {
      name: '执行者',
      description: '负责执行具体任务，调用工具完成工作',
      capabilities: ['task_execution', 'tool_invocation', 'result_reporting'],
      maxAgents: 50,
      color: '#7ED321'
    });

    this.roleDefinitions.set(AgentRole.MONITOR, {
      name: '监控者',
      description: '负责质量控制，监控任务执行状态',
      capabilities: ['quality_check', 'anomaly_detection', 'alerting'],
      maxAgents: 5,
      color: '#F5A623'
    });

    this.roleDefinitions.set(AgentRole.ORCHESTRATOR, {
      name: '编排者',
      description: '负责设计和执行工作流，协调多个Agent',
      capabilities: ['workflow_design', 'agent_coordination', 'error_recovery'],
      maxAgents: 3,
      color: '#D0021B'
    });

    this.roleDefinitions.set(AgentRole.ANALYZER, {
      name: '分析者',
      description: '负责数据分析，生成洞察报告',
      capabilities: ['data_analysis', 'pattern_recognition', 'reporting'],
      maxAgents: 10,
      color: '#9013FE'
    });

    this.roleDefinitions.set(AgentRole.PLANNER, {
      name: '规划者',
      description: '负责制定计划，评估优先级',
      capabilities: ['planning', 'prioritization', 'risk_assessment'],
      maxAgents: 3,
      color: '#50E3C2'
    });
  }

  // 为Agent分配角色
  assignRole(agentId, role) {
    if (!this.roleDefinitions.has(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    this.roleAssignments.set(agentId, {
      role,
      permissions: RolePermissions[role],
      assignedAt: new Date().toISOString()
    });
    console.log(`🎭 Agent ${agentId} assigned role: ${role}`);
  }

  // 获取Agent角色
  getRole(agentId) {
    return this.roleAssignments.get(agentId);
  }

  // 获取角色定义
  getRoleDefinition(role) {
    return this.roleDefinitions.get(role);
  }

  // 检查权限
  hasPermission(agentId, permission) {
    const assignment = this.roleAssignments.get(agentId);
    if (!assignment) return false;
    return assignment.permissions.includes(permission) || 
           assignment.permissions.includes('*');
  }

  // 列出所有角色
  listRoles() {
    return Array.from(this.roleDefinitions.entries()).map(([key, val]) => ({
      id: key,
      ...val
    }));
  }

  // 列出某角色的所有Agent
  listAgentsByRole(role) {
    return Array.from(this.roleAssignments.entries())
      .filter(([_, a]) => a.role === role)
      .map(([agentId, _]) => agentId);
  }
}

module.exports = { AgentRoleManager, AgentRole };
