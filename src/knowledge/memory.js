/**
 * Memory Inheritance - Agent记忆继承
 * 新功能：新Agent可继承历史上下文，无需重复指令
 */

class MemoryInheritance {
  constructor() {
    this.memoryStore = new Map();      // 记忆存储
    this.inheritanceRules = new Map(); // 继承规则
    this.contextTemplates = new Map();  // 上下文模板
  }

  // 保存Agent记忆
  saveMemory(agentId, memory) {
    const key = `${agentId}_${Date.now()}`;
    this.memoryStore.set(key, {
      agentId,
      content: memory.content,
      type: memory.type || 'general', // general, context, preference, learned
      importance: memory.importance || 5, // 1-10
      timestamp: new Date().toISOString(),
      tags: memory.tags || [],
      accessibleBy: memory.accessibleBy || ['*'] // 可被哪些Agent访问
    });
    console.log(`💾 Memory saved for agent ${agentId}`);
    return key;
  }

  // 继承记忆
  inherit(fromAgentId, toAgentId, options = {}) {
    const {
      types = ['context', 'preference'], // 继承哪些类型的记忆
      maxItems = 10,                     // 最多继承多少条
      timeWindow = 7 * 24 * 60 * 60 * 1000 // 时间窗口：7天
    } = options;

    const now = Date.now();
    const memories = Array.from(this.memoryStore.values())
      .filter(m => 
        m.agentId === fromAgentId &&
        types.includes(m.type) &&
        (now - new Date(m.timestamp).getTime()) < timeWindow &&
        m.accessibleBy.includes(toAgentId) || m.accessibleBy.includes('*')
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, maxItems);

    // 创建继承链
    const inheritance = {
      from: fromAgentId,
      to: toAgentId,
      memories: memories.map(m => ({
        content: m.content,
        type: m.type,
        inheritedAt: new Date().toISOString()
      }))
    };

    console.log(`🔗 ${toAgentId} inherited ${memories.length} memories from ${fromAgentId}`);
    return inheritance;
  }

  // 创建上下文模板
  createTemplate(name, template) {
    this.contextTemplates.set(name, {
      ...template,
      createdAt: new Date().toISOString()
    });
  }

  // 使用模板生成上下文
  generateContext(agentId, templateName, data = {}) {
    const template = this.contextTemplates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // 填充模板
    let context = template.context;
    for (const [key, value] of Object.entries(data)) {
      context = context.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // 添加相关记忆
    const relevantMemories = this.getRelevantMemories(agentId, template.keywords || []);
    
    return {
      template: templateName,
      context,
      memories: relevantMemories,
      generatedAt: new Date().toISOString()
    };
  }

  // 获取相关记忆
  getRelevantMemories(agentId, keywords = []) {
    return Array.from(this.memoryStore.values())
      .filter(m => 
        m.agentId === agentId &&
        m.accessibleBy.includes(agentId) || m.accessibleBy.includes('*')
      )
      .filter(m => 
        keywords.length === 0 || 
        m.tags.some(tag => keywords.includes(tag)) ||
        keywords.some(kw => m.content.includes(kw))
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);
  }

  // 设置继承规则
  setRule(fromRole, toRole, rules) {
    const key = `${fromRole}_to_${toRole}`;
    this.inheritanceRules.set(key, {
      ...rules,
      createdAt: new Date().toISOString()
    });
  }

  // 获取可继承的记忆
  getInheritableMemories(agentId, requesterId) {
    return Array.from(this.memoryStore.values())
      .filter(m => 
        m.agentId === agentId &&
        (m.accessibleBy.includes(requesterId) || m.accessibleBy.includes('*'))
      )
      .sort((a, b) => b.importance - a.importance);
  }

  // 搜索记忆
  search(query, agentId = null) {
    let results = Array.from(this.memoryStore.values());
    
    if (agentId) {
      results = results.filter(m => m.agentId === agentId);
    }

    return results.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase()) ||
      m.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // 清理过期记忆
  cleanup(days = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    let count = 0;
    
    for (const [key, memory] of this.memoryStore) {
      if (new Date(memory.timestamp).getTime() < cutoff && memory.importance < 7) {
        this.memoryStore.delete(key);
        count++;
      }
    }
    
    console.log(`🧹 Cleaned up ${count} old memories`);
    return count;
  }
}

module.exports = { MemoryInheritance };
