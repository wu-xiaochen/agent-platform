/**
 * TypeScript Type Definitions
 * 共享的类型定义
 */

// Agent相关类型
export interface Agent {
  id: string;
  name: string;
  type?: string;
  capabilities: string[];
  role?: AgentRole;
  metadata?: Record<string, any>;
  status?: 'active' | 'inactive' | 'busy';
  createdAt: string;
  updatedAt?: string;
}

export type AgentRole = 'coordinator' | 'executor' | 'monitor' | 'orchestrator' | 'analyzer' | 'planner';

export interface AgentRoleAssignment {
  role: AgentRole;
  permissions: string[];
  assignedAt: string;
}

// 工作流相关类型
export interface Workflow {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'loop';
  steps: WorkflowStep[];
  status: 'draft' | 'running' | 'paused' | 'completed' | 'failed' | 'stopped';
  config?: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  results?: any[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  agentId?: string;
  action: string;
  params?: Record<string, any>;
  condition?: string;
  dependsOn?: string[];
}

// 知识图谱相关类型
export interface Entity {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: string;
  properties?: Record<string, any>;
  createdAt: string;
}

export interface Memory {
  id: string;
  agentId: string;
  content: string;
  type: 'general' | 'context' | 'preference' | 'learned';
  importance: number; // 1-10
  tags: string[];
  accessibleBy: string[];
  createdAt: string;
}

// 指标相关类型
export interface AgentScore {
  successRate: number;
  efficiency: number;
  quality: number;
  reliability: number;
  overall: number;
}

export interface AgentMetrics {
  agentId: string;
  score: AgentScore;
  metrics: {
    successRate: number;
    avgExecutionTime: number;
    totalTasks: number;
    errorCount: number;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  agentId: string;
  metric: string;
  level: 'warning' | 'critical';
  value: number;
  threshold: number;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// 任务快照类型
export interface TaskSnapshot {
  id: string;
  taskId: string;
  state: Record<string, any>;
  step: number;
  timestamp: string;
  metadata: {
    agentId?: string;
    workflowId?: string;
    context?: Record<string, any>;
  };
}

// API响应类型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 仪表板类型
export interface DashboardStats {
  totalAgents: number;
  activeWorkflows: number;
  entitiesCount: number;
  alertsCount: number;
}
