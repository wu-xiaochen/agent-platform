/**
 * Security Sandbox - 安全沙箱
 * 资源隔离、权限控制、审计熔断
 */

class SecuritySandbox {
  constructor() {
    this.resources = new Map();
    this.auditLog = [];
    this.rateLimits = new Map();
  }

  async execute(agent, action, params) {
    // Check permissions
    if (!this.hasPermission(agent, action)) {
      throw new Error(`Permission denied for ${action}`);
    }

    // Check rate limits
    if (!this.checkRateLimit(agent.id)) {
      throw new Error(`Rate limit exceeded for ${agent.id}`);
    }

    // Log the action
    this.log(agent.id, action, params);

    // Execute in sandbox
    return await this.executeInSandbox(action, params);
  }

  hasPermission(agent, action) {
    const permissions = agent.permissions || [];
    return permissions.includes(action) || permissions.includes('*');
  }

  checkRateLimit(agentId) {
    const limit = this.rateLimits.get(agentId) || { count: 0, window: Date.now() };
    const now = Date.now();
    
    // Reset window every minute
    if (now - limit.window > 60000) {
      limit.count = 0;
      limit.window = now;
    }

    if (limit.count >= 100) { // 100 requests per minute
      return false;
    }

    limit.count++;
    this.rateLimits.set(agentId, limit);
    return true;
  }

  log(agentId, action, params) {
    this.auditLog.push({
      agentId,
      action,
      params,
      timestamp: new Date().toISOString()
    });
  }

  async executeInSandbox(action, params) {
    // Simulate sandboxed execution
    return { status: 'success', action, result: 'sandboxed_result' };
  }

  getAuditLog(agentId) {
    return this.auditLog.filter(log => log.agentId === agentId);
  }
}

module.exports = { SecuritySandbox };
