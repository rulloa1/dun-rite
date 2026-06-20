/* Projects Manager UI */

function ProjectsManagerView() {
  const [projects, setProjects] = React.useState(window.ProjectsManager.getProjects());
  const [activeProjectId, setActiveProjectId] = React.useState(window.ProjectsManager.getActiveProject());
  const [viewMode, setViewMode] = React.useState('list'); // list, create, edit
  const [selectedProjectId, setSelectedProjectId] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const activeProject = projects.find(p => p.id === activeProjectId);
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateProject = (name, details) => {
    const newProject = window.ProjectsManager.createNewProject(name, details);
    setProjects([...projects, newProject]);
    setViewMode('list');
  };

  const handleUpdateProject = (projectId, updates) => {
    const updated = window.ProjectsManager.updateProject(projectId, updates);
    const newProjects = projects.map(p => p.id === projectId ? updated : p);
    setProjects(newProjects);
    setViewMode('list');
  };

  const handleDeleteProject = (projectId) => {
    if (confirm('Delete this project? This cannot be undone.')) {
      window.ProjectsManager.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      if (activeProjectId === projectId) {
        const newActive = projects[0]?.id;
        setActiveProjectId(newActive);
        window.ProjectsManager.setActiveProject(newActive);
      }
    }
  };

  const handleSetActiveProject = (projectId) => {
    setActiveProjectId(projectId);
    window.ProjectsManager.setActiveProject(projectId);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  // List View
  const ListView = () => React.createElement('div', { className: 'projects-list-view' },
    React.createElement('div', { className: 'projects-header' },
      React.createElement('h2', null, 'Projects'),
      React.createElement('button', {
        className: 'btn btn--primary',
        onClick: () => setViewMode('create')
      }, '+ New Project')
    ),

    React.createElement('div', { className: 'projects-controls' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search projects...',
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        className: 'projects-search'
      }),
      React.createElement('select', {
        value: filterStatus,
        onChange: (e) => setFilterStatus(e.target.value),
        className: 'projects-filter'
      },
        React.createElement('option', { value: 'all' }, 'All Status'),
        React.createElement('option', { value: 'planning' }, 'Planning'),
        React.createElement('option', { value: 'active' }, 'Active'),
        React.createElement('option', { value: 'on-hold' }, 'On Hold'),
        React.createElement('option', { value: 'completed' }, 'Completed'),
        React.createElement('option', { value: 'archived' }, 'Archived')
      )
    ),

    filteredProjects.length === 0
      ? React.createElement('div', { className: 'projects-empty' },
          React.createElement('p', null, 'No projects found')
        )
      : React.createElement('div', { className: 'projects-grid' },
          filteredProjects.map(project =>
            React.createElement('div', {
              key: project.id,
              className: 'project-card ' + (activeProjectId === project.id ? 'is-active' : ''),
              onClick: () => handleSetActiveProject(project.id)
            },
              React.createElement('div', { className: 'project-card-header', style: { borderTopColor: project.color } },
                React.createElement('h3', null, project.name),
                React.createElement('span', { className: 'project-status ' + project.status }, project.status)
              ),
              React.createElement('div', { className: 'project-card-body' },
                React.createElement('div', { className: 'project-meta' },
                  React.createElement('div', null,
                    React.createElement('label', null, 'Client'),
                    React.createElement('p', null, project.client || 'N/A')
                  ),
                  React.createElement('div', null,
                    React.createElement('label', null, 'Location'),
                    React.createElement('p', null, project.location || 'N/A')
                  ),
                  React.createElement('div', null,
                    React.createElement('label', null, 'PM'),
                    React.createElement('p', null, project.pm || 'Unassigned')
                  )
                ),
                React.createElement('div', { className: 'project-budget' },
                  React.createElement('label', null, 'Budget'),
                  React.createElement('p', null, usd(project.budget))
                ),
                React.createElement('div', { className: 'project-dates' },
                  React.createElement('label', null, 'Timeline'),
                  React.createElement('p', null,
                    new Date(project.startDate).toLocaleDateString() + ' — ' +
                    (project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD')
                  )
                )
              ),
              React.createElement('div', { className: 'project-card-footer' },
                React.createElement('button', {
                  className: 'btn btn--sm',
                  onClick: (e) => {
                    e.stopPropagation();
                    setSelectedProjectId(project.id);
                    setViewMode('edit');
                  }
                }, 'Edit'),
                React.createElement('button', {
                  className: 'btn btn--sm btn--danger',
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }
                }, 'Delete')
              )
            )
          )
        )
  );

  // Create/Edit View
  const FormView = () => {
    const isEdit = viewMode === 'edit';
    const project = isEdit ? selectedProject : null;
    const [formData, setFormData] = React.useState(project || {
      name: '',
      client: '',
      location: '',
      address: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: 0,
      status: 'planning',
      pm: '',
      description: '',
      color: '#1DB4E8'
    });

    const handleSubmit = () => {
      if (!formData.name.trim()) {
        alert('Project name is required');
        return;
      }
      if (isEdit) {
        handleUpdateProject(selectedProjectId, formData);
      } else {
        handleCreateProject(formData.name, formData);
      }
    };

    return React.createElement('div', { className: 'projects-form-view' },
      React.createElement('div', { className: 'form-header' },
        React.createElement('h2', null, isEdit ? 'Edit Project' : 'Create New Project'),
        React.createElement('button', {
          className: 'btn-close',
          onClick: () => setViewMode('list')
        }, '✕')
      ),

      React.createElement('div', { className: 'form-grid' },
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Project Name *'),
          React.createElement('input', {
            type: 'text',
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Client'),
          React.createElement('input', {
            type: 'text',
            value: formData.client,
            onChange: (e) => setFormData({ ...formData, client: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Project Manager'),
          React.createElement('input', {
            type: 'text',
            value: formData.pm,
            onChange: (e) => setFormData({ ...formData, pm: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Status'),
          React.createElement('select', {
            value: formData.status,
            onChange: (e) => setFormData({ ...formData, status: e.target.value })
          },
            React.createElement('option', { value: 'planning' }, 'Planning'),
            React.createElement('option', { value: 'active' }, 'Active'),
            React.createElement('option', { value: 'on-hold' }, 'On Hold'),
            React.createElement('option', { value: 'completed' }, 'Completed'),
            React.createElement('option', { value: 'archived' }, 'Archived')
          )
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Location'),
          React.createElement('input', {
            type: 'text',
            value: formData.location,
            onChange: (e) => setFormData({ ...formData, location: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Address'),
          React.createElement('input', {
            type: 'text',
            value: formData.address,
            onChange: (e) => setFormData({ ...formData, address: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Budget'),
          React.createElement('input', {
            type: 'number',
            value: formData.budget,
            onChange: (e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Start Date'),
          React.createElement('input', {
            type: 'date',
            value: formData.startDate,
            onChange: (e) => setFormData({ ...formData, startDate: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'End Date'),
          React.createElement('input', {
            type: 'date',
            value: formData.endDate,
            onChange: (e) => setFormData({ ...formData, endDate: e.target.value })
          })
        ),
        React.createElement('div', { className: 'form-field' },
          React.createElement('label', null, 'Color'),
          React.createElement('input', {
            type: 'color',
            value: formData.color,
            onChange: (e) => setFormData({ ...formData, color: e.target.value })
          })
        )
      ),

      React.createElement('div', { className: 'form-field full' },
        React.createElement('label', null, 'Description'),
        React.createElement('textarea', {
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          rows: 4
        })
      ),

      React.createElement('div', { className: 'form-actions' },
        React.createElement('button', {
          className: 'btn btn--primary',
          onClick: handleSubmit
        }, isEdit ? 'Update Project' : 'Create Project'),
        React.createElement('button', {
          className: 'btn',
          onClick: () => setViewMode('list')
        }, 'Cancel')
      )
    );
  };

  return React.createElement('div', { className: 'projects-manager-view' },
    viewMode === 'list' && React.createElement(ListView),
    (viewMode === 'create' || viewMode === 'edit') && React.createElement(FormView)
  );
}

Object.assign(window, { ProjectsManagerView });
