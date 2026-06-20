/* Gantt Chart Data Model & Engine */

window.GanttEngine = (function(){
  
  // Task structure
  const createTask = (name, startDate, duration, overrides = {}) => ({
    id: 'TASK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    name,
    startDate: new Date(startDate),
    duration, // in days
    endDate: new Date(new Date(startDate).getTime() + duration * 24 * 60 * 60 * 1000),
    progress: overrides.progress || 0, // 0-100
    status: overrides.status || 'scheduled', // scheduled, in-progress, completed, on-hold, delayed
    trade: overrides.trade || '',
    crew: overrides.crew || [], // array of crew member ids
    budget: overrides.budget || 0,
    dependencies: overrides.dependencies || [], // array of task ids
    isMilestone: overrides.isMilestone || false,
    notes: overrides.notes || '',
    ...overrides
  });

  // Calculate critical path
  const calculateCriticalPath = (tasks) => {
    // Simple critical path: longest dependency chain
    const visited = new Set();
    const pathLengths = {};

    const calculatePathLength = (taskId) => {
      if (pathLengths[taskId] !== undefined) return pathLengths[taskId];
      if (visited.has(taskId)) return 0; // Avoid cycles

      visited.add(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return 0;

      let maxDependencyLength = 0;
      if (task.dependencies && task.dependencies.length > 0) {
        maxDependencyLength = Math.max(
          ...task.dependencies.map(depId => calculatePathLength(depId))
        );
      }

      pathLengths[taskId] = task.duration + maxDependencyLength;
      visited.delete(taskId);
      return pathLengths[taskId];
    };

    tasks.forEach(task => calculatePathLength(task.id));
    
    const criticalPathLength = Math.max(...Object.values(pathLengths), 0);
    const criticalTasks = tasks.filter(t => pathLengths[t.id] === criticalPathLength);
    
    return { criticalTasks, pathLengths, criticalPathLength };
  };

  // Get task dependencies recursively
  const getTaskDependencies = (taskId, tasks) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) return [];
    
    let allDeps = [...task.dependencies];
    task.dependencies.forEach(depId => {
      allDeps = allDeps.concat(getTaskDependencies(depId, tasks));
    });
    return [...new Set(allDeps)];
  };

  // Get dependent tasks (tasks that depend on this one)
  const getDependentTasks = (taskId, tasks) => {
    return tasks.filter(t => t.dependencies && t.dependencies.includes(taskId));
  };

  // Update task dates (with dependency validation)
  const updateTaskDates = (taskId, newStartDate, tasks) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return tasks;

    const offset = new Date(newStartDate).getTime() - task.startDate.getTime();
    const updated = [...tasks];
    
    // Update task and all dependent tasks
    const toUpdate = [taskId];
    const visited = new Set();

    while (toUpdate.length > 0) {
      const currentId = toUpdate.pop();
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const idx = updated.findIndex(t => t.id === currentId);
      if (idx >= 0) {
        updated[idx] = {
          ...updated[idx],
          startDate: new Date(updated[idx].startDate.getTime() + offset),
          endDate: new Date(updated[idx].endDate.getTime() + offset)
        };
        
        // Add dependent tasks to update queue
        getDependentTasks(currentId, updated).forEach(dep => {
          if (!visited.has(dep.id)) toUpdate.push(dep.id);
        });
      }
    }

    return updated;
  };

  // Calculate project dates
  const getProjectTimespan = (tasks) => {
    if (tasks.length === 0) return { start: new Date(), end: new Date(), days: 0 };
    
    const starts = tasks.map(t => new Date(t.startDate).getTime());
    const ends = tasks.map(t => new Date(t.endDate).getTime());
    
    const start = new Date(Math.min(...starts));
    const end = new Date(Math.max(...ends));
    const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    
    return { start, end, days };
  };

  // Get tasks for week
  const getTasksForWeek = (weekStart, tasks) => {
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(t => {
      const tStart = new Date(t.startDate);
      const tEnd = new Date(t.endDate);
      return tStart < weekEnd && tEnd > weekStart;
    });
  };

  // Calculate task position in timeline
  const getTaskPosition = (task, projectStart) => {
    const taskStart = new Date(task.startDate);
    const dayOffset = Math.floor((taskStart.getTime() - projectStart.getTime()) / (24 * 60 * 60 * 1000));
    const width = task.duration;
    return { left: dayOffset, width };
  };

  // Add crew member to task
  const addCrewToTask = (taskId, crewMember, tasks) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return tasks;
    if (!task.crew) task.crew = [];
    if (!task.crew.find(c => c.id === crewMember.id)) {
      task.crew.push(crewMember);
    }
    return [...tasks];
  };

  // Remove crew from task
  const removeCrewFromTask = (taskId, crewId, tasks) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return tasks;
    task.crew = task.crew.filter(c => c.id !== crewId);
    return [...tasks];
  };

  // Update task progress
  const updateProgress = (taskId, progress, tasks) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return tasks;
    task.progress = Math.max(0, Math.min(100, progress));
    if (progress === 100) task.status = 'completed';
    else if (progress > 0) task.status = 'in-progress';
    else task.status = 'scheduled';
    return [...tasks];
  };

  return {
    createTask,
    calculateCriticalPath,
    getTaskDependencies,
    getDependentTasks,
    updateTaskDates,
    getProjectTimespan,
    getTasksForWeek,
    getTaskPosition,
    addCrewToTask,
    removeCrewFromTask,
    updateProgress
  };
})();
