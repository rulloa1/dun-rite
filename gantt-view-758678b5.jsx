/* Interactive Gantt Chart View */

function GanttChartView() {
  const [tasks, setTasks] = React.useState([
    window.GanttEngine.createTask('Excavate & Backfill', '2026-08-17', 10, { trade: 'Site Work', budget: 12500, crew: [{id: 'C1', name: 'John Doe', role: 'Operator'}] }),
    window.GanttEngine.createTask('Piles/Caissons', '2026-08-27', 15, { trade: 'Foundation', budget: 43000, dependencies: ['TASK-0'] }),
    window.GanttEngine.createTask('Structural Concrete', '2026-09-11', 20, { trade: 'Concrete', budget: 30000, dependencies: ['TASK-1'] }),
    window.GanttEngine.createTask('Structural Steel', '2026-10-01', 20, { trade: 'Metals', budget: 20000, dependencies: ['TASK-2'] }),
    window.GanttEngine.createTask('Rough Framing', '2026-10-21', 30, { trade: 'Wood & Plastics', budget: 19500, dependencies: ['TASK-3'] }),
    window.GanttEngine.createTask('Swimming Pool', '2026-08-17', 90, { trade: 'Special Construction', budget: 477938.75, isMilestone: false }),
    window.GanttEngine.createTask('Electrical Sub', '2026-11-20', 100, { trade: 'Electrical', budget: 52992.69, dependencies: ['TASK-4'] }),
    window.GanttEngine.createTask('HVAC', '2026-11-20', 45, { trade: 'Mechanical', budget: 22500, dependencies: ['TASK-4'] }),
    window.GanttEngine.createTask('Plumbing', '2026-11-20', 45, { trade: 'Mechanical', budget: 17500, dependencies: ['TASK-4'] }),
  ]);

  const [draggedTask, setDraggedTask] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [projectStart, setProjectStart] = React.useState(new Date('2026-08-17'));

  const timespan = window.GanttEngine.getProjectTimespan(tasks);
  const { criticalTasks } = window.GanttEngine.calculateCriticalPath(tasks);
  const isCritical = (taskId) => criticalTasks.some(t => t.id === taskId);

  const handleDragStart = (e, taskId) => {
    setDraggedTask({ id: taskId, startX: e.clientX });
  };

  const handleDragEnd = (e, taskId) => {
    if (!draggedTask) return;
    const deltaX = e.clientX - draggedTask.startX;
    const daysOffset = Math.round(deltaX / 40); // ~40px per day
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStartDate = new Date(task.startDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
      const updated = window.GanttEngine.updateTaskDates(taskId, newStartDate, tasks);
      setTasks(updated);
    }
    setDraggedTask(null);
  };

  const handleUpdateProgress = (taskId, progress) => {
    const updated = window.GanttEngine.updateProgress(taskId, progress, tasks);
    setTasks(updated);
  };

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return React.createElement('div', { className: 'gantt-view' },
    // Header
    React.createElement('div', { className: 'gantt-header' },
      React.createElement('h2', null, 'Project Schedule — Gantt Chart'),
      React.createElement('div', { className: 'gantt-timeline-info' },
        React.createElement('span', null, 'Start: ' + formatDate(timespan.start)),
        React.createElement('span', null, 'End: ' + formatDate(timespan.end)),
        React.createElement('span', null, timespan.days + ' days total'),
        React.createElement('span', { className: 'critical-indicator' }, '●  Critical Path')
      )
    ),

    React.createElement('div', { className: 'gantt-container' },
      // Left panel: Task list
      React.createElement('div', { className: 'gantt-tasks' },
        React.createElement('div', { className: 'gantt-tasks-header' },
          React.createElement('div', { className: 'task-name-col' }, 'Task'),
          React.createElement('div', { className: 'task-trade-col' }, 'Trade'),
          React.createElement('div', { className: 'task-duration-col' }, 'Days'),
          React.createElement('div', { className: 'task-progress-col' }, 'Progress')
        ),
        React.createElement('div', { className: 'gantt-tasks-list' },
          tasks.map(task =>
            React.createElement('div', {
              key: task.id,
              className: 'gantt-task-row ' + (isCritical(task.id) ? 'is-critical' : '') + (selectedTask?.id === task.id ? ' is-selected' : ''),
              onClick: () => setSelectedTask(task)
            },
              React.createElement('div', { className: 'task-name-col' },
                React.createElement('span', { className: task.isMilestone ? 'milestone-marker' : '' }, task.name)
              ),
              React.createElement('div', { className: 'task-trade-col' }, task.trade),
              React.createElement('div', { className: 'task-duration-col' }, task.duration + 'd'),
              React.createElement('div', { className: 'task-progress-col' },
                React.createElement('div', { className: 'progress-bar' },
                  React.createElement('div', { 
                    className: 'progress-fill',
                    style: { width: task.progress + '%' }
                  })
                ),
                React.createElement('span', { className: 'progress-text' }, task.progress + '%')
              )
            )
          )
        )
      ),

      // Right panel: Timeline
      React.createElement('div', { className: 'gantt-timeline' },
        React.createElement('div', { className: 'gantt-timeline-header' },
          React.createElement('div', { className: 'timeline-months' },
            ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) =>
              React.createElement('div', { 
                key: month,
                className: 'timeline-month',
                style: { width: '20%' }
              }, month + ' \'26')
            )
          )
        ),

        React.createElement('div', { className: 'gantt-bars' },
          tasks.map(task => {
            const pos = window.GanttEngine.getTaskPosition(task, timespan.start);
            return React.createElement('div', {
              key: task.id,
              className: 'gantt-task-bar-row'
            },
              React.createElement('div', {
                className: 'gantt-bar ' + task.status + ' ' + (isCritical(task.id) ? 'critical' : ''),
                style: {
                  left: (pos.left / timespan.days * 100) + '%',
                  width: (pos.width / timespan.days * 100) + '%',
                  position: 'absolute',
                  height: '32px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '8px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'grab',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                },
                draggable: true,
                onDragStart: (e) => handleDragStart(e, task.id),
                onDragEnd: (e) => handleDragEnd(e, task.id)
              },
                React.createElement('div', { 
                  className: 'progress-indicator',
                  style: { 
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    background: 'rgba(255,255,255,0.3)',
                    width: task.progress + '%'
                  }
                }),
                React.createElement('span', { style: { position: 'relative', zIndex: 1 } },
                  task.name.substring(0, 20)
                )
              )
            );
          })
        )
      )
    ),

    // Task Details Panel
    selectedTask && React.createElement('div', { className: 'gantt-details' },
      React.createElement('div', { className: 'details-header' },
        React.createElement('h3', null, selectedTask.name),
        React.createElement('button', {
          className: 'btn-close',
          onClick: () => setSelectedTask(null)
        }, '✕')
      ),
      React.createElement('div', { className: 'details-content' },
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Trade'),
          React.createElement('p', null, selectedTask.trade || 'N/A')
        ),
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Duration'),
          React.createElement('p', null, selectedTask.duration + ' days')
        ),
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Dates'),
          React.createElement('p', null, formatDate(selectedTask.startDate) + ' — ' + formatDate(selectedTask.endDate))
        ),
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Budget'),
          React.createElement('p', null, usd(selectedTask.budget))
        ),
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Progress'),
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 100,
            value: selectedTask.progress,
            onChange: (e) => handleUpdateProgress(selectedTask.id, parseInt(e.target.value)),
            style: { width: '100%' }
          }),
          React.createElement('span', null, selectedTask.progress + '%')
        ),
        React.createElement('div', { className: 'detail-field' },
          React.createElement('label', null, 'Status'),
          React.createElement('span', { className: 'status-badge ' + selectedTask.status }, selectedTask.status)
        ),
        isCritical(selectedTask.id) && React.createElement('div', { className: 'critical-warning' },
          React.createElement('span', null, '⚠ On Critical Path')
        )
      )
    )
  );
}

Object.assign(window, { GanttChartView });
