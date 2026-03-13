/**
 * Metrics Dashboard - 量化指标仪表盘
 * 解决：无法评估Agent实际工作质量问题
 */

class MetricsDashboard {
  constructor() {
    this.metrics = new Map();
    this.aggregations = new Map();
    this.alerts = [];
  }

  // 记录指标
  record(metric) {
    const { agentId, name, value, unit = 'count', timestamp = Date.now() } = metric;
    
    if (!this.metrics.has(agentId)) {
      this.metrics.set(agentId, new Map());
    }
    
    const agentMetrics = this.metrics.get(agentId);
    if (!agentMetrics.has(name)) {
      agentMetrics.set(name, []);
    }
    
    agentMetrics.get(name).push({
      value,
      unit,
      timestamp
    });
    
    // 检查阈值
    this.checkThreshold(agentId, name, value);
  }

  // 聚合指标
  aggregate(agentId, name, type = 'avg') {
    const values = this.metrics.get(agentId)?.get(name) || [];
    if (values.length === 0) return 0;

    const nums = values.map(v => v.value);
    switch (type) {
      case 'avg':
        return nums.reduce((a, b) => a + b, 0) / nums.length;
      case 'sum':
        return nums.reduce((a, b) => a + b, 0);
      case 'min':
        return Math.min(...nums);
      case 'max':
        return Math.max(...nums);
      case 'count':
        return nums.length;
      default:
        return 0;
    }
  }

  // 获取Agent综合评分
  getScore(agentId) {
    const scores = {
      successRate: this.calculateSuccessRate(agentId),
      efficiency: this.calculateEfficiency(agentId),
      quality: this.calculateQuality(agentId),
      reliability: this.calculateReliability(agentId)
    };
    
    // 加权平均
    const weights = { successRate: 0.3, efficiency: 0.25, quality: 0.25, reliability: 0.2 };
    const overall = Object.keys(scores).reduce((sum, key) => 
      sum + scores[key] * weights[key], 0);
    
    return { ...scores, overall: Math.round(overall * 100) / 100 };
  }

  calculateSuccessRate(agentId) {
    const total = this.aggregate(agentId, 'task_completed', 'count') + 
                  this.aggregate(agentId, 'task_failed', 'count');
    if (total === 0) return 0.5;
    return this.aggregate(agentId, 'task_completed', 'count') / total;
  }

  calculateEfficiency(agentId) {
    const avgTime = this.aggregate(agentId, 'execution_time', 'avg');
    if (!avgTime || avgTime === 0) return 0.5;
    // 假设5分钟为满分，30分钟为0分
    return Math.max(0, Math.min(1, 1 - (avgTime - 300000) / (1800000 - 300000)));
  }

  calculateQuality(agentId) {
    const errors = this.aggregate(agentId, 'error_count', 'sum') || 0;
    const reviews = this.aggregate(agentId, 'review_score', 'avg') || 0;
    return Math.max(0, Math.min(1, (reviews * 0.7) - (errors * 0.1)));
  }

  calculateReliability(agentId) {
    const timeouts = this.aggregate(agentId, 'timeout_count', 'sum') || 0;
    const total = this.aggregate(agentId, 'task_total', 'count') || 1;
    return Math.max(0, Math.min(1, 1 - (timeouts / total)));
  }

  // 阈值检查
  checkThreshold(agentId, name, value) {
    const thresholds = {
      error_count: { warning: 5, critical: 10 },
      execution_time: { warning: 600000, critical: 1200000 }, // 10min, 20min
      success_rate: { warning: 0.7, critical: 0.5 }
    };

    const threshold = thresholds[name];
    if (!threshold) return;

    let level = null;
    if (value >= threshold.critical) level = 'critical';
    else if (value >= threshold.warning) level = 'warning';

    if (level) {
      this.createAlert(agentId, name, level, value, threshold[level]);
    }
  }

  // 创建告警
  createAlert(agentId, metric, level, value, threshold) {
    const alert = {
      id: `alert_${Date.now()}`,
      agentId,
      metric,
      level,
      value,
      threshold,
      message: `${metric} ${level}: ${value} (threshold: ${threshold})`,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    this.alerts.push(alert);
    console.log(`🚨 Alert [${level.toUpperCase()}]: ${alert.message}`);
    return alert;
  }

  // 获取仪表盘数据
  getDashboard(agentId = null) {
    const agents = agentId ? [agentId] : Array.from(this.metrics.keys());
    
    return agents.map(id => ({
      agentId: id,
      score: this.getScore(id),
      metrics: {
        successRate: this.calculateSuccessRate(id),
        avgExecutionTime: this.aggregate(id, 'execution_time', 'avg'),
        totalTasks: this.aggregate(id, 'task_completed', 'count') + 
                    this.aggregate(id, 'task_failed', 'count'),
        errorCount: this.aggregate(id, 'error_count', 'sum')
      },
      alerts: this.alerts.filter(a => a.agentId === id && !a.acknowledged)
    }));
  }

  // 确认告警
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }
}

module.exports = { MetricsDashboard };
