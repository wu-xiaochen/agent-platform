/**
 * Agent Registry - Agent注册与发现
 */

class AgentRegistry {
  constructor() {
    this.agents = new Map();
  }

  async register(agent) {
    const id = agent.id || `agent_${Date.now()}`;
    this.agents.set(id, {
      ...agent,
      id,
      registeredAt: new Date().toISOString()
    });
    console.log(`✅ Agent registered: ${id}`);
    return id;
  }

  async find(criteria) {
    const results = [];
    for (const [id, agent] of this.agents) {
      let match = true;
      for (const [key, value] of Object.entries(criteria)) {
        if (agent[key] !== value) {
          match = false;
          break;
        }
      }
      if (match) results.push(agent);
    }
    return results;
  }

  get(id) {
    return this.agents.get(id);
  }

  list() {
    return Array.from(this.agents.values());
  }
}

module.exports = { AgentRegistry };
