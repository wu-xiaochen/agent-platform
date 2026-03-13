/**
 * Task Snapshot - 任务快照与断点续传
 * 解决：Agent任务中途失败无法追溯问题
 */

class TaskSnapshot {
  constructor() {
    this.snapshots = new Map();
    this.checkpoints = new Map();
  }

  // 创建任务快照
  createSnapshot(taskId, state) {
    const snapshot = {
      id: `snapshot_${Date.now()}`,
      taskId,
      state: this.deepClone(state),
      timestamp: new Date().toISOString(),
      step: state.step || 0,
      metadata: {
        agentId: state.agentId,
        workflowId: state.workflowId,
        context: state.context || {}
      }
    };
    this.snapshots.set(taskId, snapshot);
    console.log(`📸 Snapshot created for task ${taskId} at step ${snapshot.step}`);
    return snapshot;
  }

  // 创建断点
  createCheckpoint(taskId, step, data) {
    const checkpoint = {
      id: `checkpoint_${taskId}_${step}`,
      taskId,
      step,
      data: this.deepClone(data),
      timestamp: new Date().toISOString()
    };
    this.checkpoints.set(checkpoint.id, checkpoint);
    return checkpoint;
  }

  // 从快照恢复
  restore(taskId) {
    const snapshot = this.snapshots.get(taskId);
    if (!snapshot) {
      throw new Error(`No snapshot found for task ${taskId}`);
    }
    console.log(`♻️ Restoring task ${taskId} from snapshot at step ${snapshot.step}`);
    return snapshot;
  }

  // 从断点恢复
  restoreFromCheckpoint(checkpointId) {
    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint ${checkpointId} not found`);
    }
    console.log(`♻️ Restoring from checkpoint step ${checkpoint.step}`);
    return checkpoint;
  }

  // 列出任务的所有快照
  listSnapshots(taskId) {
    return Array.from(this.snapshots.values())
      .filter(s => s.taskId === taskId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // 获取最近一次快照
  getLatest(taskId) {
    const snapshots = this.listSnapshots(taskId);
    return snapshots[0] || null;
  }

  // 删除旧快照（保留最近N个）
  cleanup(taskId, keep = 5) {
    const snapshots = this.listSnapshots(taskId);
    if (snapshots.length > keep) {
      const toDelete = snapshots.slice(keep);
      for (const s of toDelete) {
        this.snapshots.delete(s.taskId);
      }
    }
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

module.exports = { TaskSnapshot };
