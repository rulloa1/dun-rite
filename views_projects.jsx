/* Projects Manager — Create, Edit, Switch Projects */

function ProjectsManager() {
  const [projects, setProjects] = React.useState(() => {
    const saved = JSON.parse(localStorage.getItem('dr_projects')) || [];
    // Initialize with Longleaf if no projects exist
    if (saved.length === 0) {
      return [{
        id: 'longleaf-001',
        name: 'Longleaf Amenity Center',
        location: 'San Antonio, TX',
        client: 'Longleaf Development',
        projectNumber: 'BP-2026-014',
        status: 'active',
        startDate: '2026-08-15',
        completionDate: '2026-12-15',
        budget: 1350000,
        description: 'Amenity center construction including pool, landscaping, and site infrastructure',
        manager: 'Michael E. Chandler',
        createdAt: new Date().toISOString()
      }];
    }
    return saved;
  });

  const [viewMode, setViewMode] = React.useState('list'); // list, create, edit
  const [selectedProjectId, setSelectedProjectId] = React.useState(
    localStorage.getItem('dr_active_project') || (projects[0]?.id || null)
  );
  const [formData, setFormData] = React.useState({
    name: '',
    location: '',
    client: '',
    projectNumber: '',
    status: 'active',
    startDate: '',
    completionDate: '',
    budget: 0,
    description: '',
    manager: ''
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateNew = () => {
    setFormData({
      name: '',
      location: '',
      client: '',
      projectNumber: '',
      status: 'active',
      startDate: '',
      completionDate: '',
      budget: 0,
      description: '',
      manager: ''
    });
    setViewMode('create');
  };

  const handleEdit = (project) => {
    setFormData(project);
    setSelectedProjectId(project.id);
    setViewMode('edit');
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('Project name and location are required');
      return;
    }

    if (viewMode === 'create') {
      const newProject = {
        ...formData,
        id: 'proj-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('dr_projects', JSON.stringify(updatedProjects));
      setSelectedProjectId(newProject.id);
      localStorage.setItem('dr_active_project', newProject.id);
      setViewMode('list');
      alert('Project created successfully!');
    } else {
      const updatedProjects = projects.map(p => 
        p.id === selectedProjectId ? { ...p, ...formData } : p
      );
      setProjects(updatedProjects);
      localStorage.setItem('dr_projects', JSON.stringify(updatedProjects));
      setViewMode('list');
      alert('Project updated successfully!');
    }
  };

  const handleDelete = (projectId) => {
    if (confirm('Delete this project? This cannot be undone.')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('dr_projects', JSON.stringify(updatedProjects));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(updatedProjects[0]?.id || null);
        localStorage.setItem('dr_active_project', updatedProjects[0]?.id || '');
      }
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('dr_active_project', projectId);
    // Reload the app to switch projects
    window.location.reload();
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

  // List View
  const ListView = () => React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'page-head' },
      React.createElement('div', null,
        React.createElement('h1', null, 'Projects'),
        React.createElement('div', { className: 'sub' },
          React.createElement('span', { className: 'chip' }, 'Manage all construction projects')
        )
      ),
      React.createElement('button', {
        className: 'btn btn--primary',
        onClick: handleCreateNew
      }, '+ New Project')
    ),

    React.createElement('div', { className: 'card tablecard' },
      React.createElement('div', { className: 'card__h' },
        React.createElement('h3', null, 'All Projects (' + filteredProjects.length + ')'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            padding: '8px 12px',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            fontSize: '13px',
            width: '200px'
          }
        })
      ),

      React.createElement('table', { className: 'tbl' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Project Name'),
            React.createElement('th', null, 'Location'),
            React.createElement('th', null, 'Client'),
            React.createElement('th', null, 'Budget'),
            React.createElement('th', null, 'Status'),
            React.createElement('th', { style: { width: 150 } }, 'Actions')
          )
        ),
        React.createElement('tbody', null,
          filteredProjects.map(project =>
            React.createElement('tr', { key: project.id, className: selectedProjectId === project.id ? 'is-active' : '' },
              React.createElement('td', { style: { fontWeight: 600 } }, project.name),
              React.createElement('td', null, project.location),
              React.createElement('td', null, project.client),
              React.createElement('td', null, usd(project.budget)),
              React.createElement('td', null,
                React.createElement('span', { className: 'pill pill--' + project.status }, project.status)
              ),
              React.createElement('td', null,
                React.createElement('div', { style: { display: 'flex', gap: 6 } },
                  React.createElement('button', {
                    className: 'btn btn--sm',
                    onClick: () => handleSelectProject(project.id)
                  }, selectedProjectId === project.id ? '✓ Active' : 'Activate'),
                  React.createElement('button', {
                    className: 'btn btn--sm',
                    onClick: () => handleEdit(project)
                  }, 'Edit'),
                  React.createElement('button', {
                    className: 'btn btn--sm btn--danger',
                    onClick: () => handleDelete(project.id)
                  }, 'Delete')
                )
              )
            )
          )
        )
      )
    )
  );

  // Form View
  const FormView = () => React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'page-head' },
      React.createElement('h1', null, viewMode === 'create' ? 'New Project' : 'Edit Project'),
      React.createElement('button', {
        className: 'btn',
        onClick: () => setViewMode('list')
      }, 'Cancel')
    ),

    React.createElement('div', { className: 'card', style: { maxWidth: '800px' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 } },
        // Basic Info
        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Project Name'),
          React.createElement('input', {
            type: 'text',
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
            placeholder: 'e.g., Longleaf Amenity Center',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Project Number'),
          React.createElement('input', {
            type: 'text',
            value: formData.projectNumber,
            onChange: (e) => setFormData({ ...formData, projectNumber: e.target.value }),
            placeholder: 'e.g., BP-2026-014',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Location'),
          React.createElement('input', {
            type: 'text',
            value: formData.location,
            onChange: (e) => setFormData({ ...formData, location: e.target.value }),
            placeholder: 'e.g., San Antonio, TX',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Client'),
          React.createElement('input', {
            type: 'text',
            value: formData.client,
            onChange: (e) => setFormData({ ...formData, client: e.target.value }),
            placeholder: 'e.g., Longleaf Development',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Budget'),
          React.createElement('input', {
            type: 'number',
            value: formData.budget,
            onChange: (e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 }),
            placeholder: '1350000',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Project Manager'),
          React.createElement('input', {
            type: 'text',
            value: formData.manager,
            onChange: (e) => setFormData({ ...formData, manager: e.target.value }),
            placeholder: 'e.g., Michael E. Chandler',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Start Date'),
          React.createElement('input', {
            type: 'date',
            value: formData.startDate,
            onChange: (e) => setFormData({ ...formData, startDate: e.target.value }),
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Completion Date'),
          React.createElement('input', {
            type: 'date',
            value: formData.completionDate,
            onChange: (e) => setFormData({ ...formData, completionDate: e.target.value }),
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          })
        ),

        React.createElement('div', null,
          React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' } }, 'Status'),
          React.createElement('select', {
            value: formData.status,
            onChange: (e) => setFormData({ ...formData, status: e.target.value }),
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6 }
          },
            React.createElement('option', { value: 'planning' }, 'Planning'),
            React.createElement('option', { value: 'active' }, 'Active'),
            React.createElement('option', { value: 'paused' }, 'Paused'),
            React.createElement('option', { value: 'completed' }, 'Completed'),
            React.createElement('option', { value: 'archived' }, 'Archived')
          )
        )
      ),

      // Description
      React.createElement('div', { style: { marginTop: 20 } },
        React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', display: 'block' } }, 'Description'),
        React.createElement('textarea', {
          value: formData.description,
          onChange: (e) => setFormData({ ...formData, description: e.target.value }),
          placeholder: 'Project details and scope...',
          rows: 4,
          style: { width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '4px', marginTop: 6, fontFamily: 'inherit' }
        })
      ),

      // Actions
      React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' } },
        React.createElement('button', {
          className: 'btn',
          onClick: () => setViewMode('list')
        }, 'Cancel'),
        React.createElement('button', {
          className: 'btn btn--primary',
          onClick: handleSave
        }, viewMode === 'create' ? 'Create Project' : 'Save Changes')
      )
    )
  );

  return React.createElement(React.Fragment, null,
    viewMode === 'list' && React.createElement(ListView),
    (viewMode === 'create' || viewMode === 'edit') && React.createElement(FormView)
  );
}

window.ProjectsManager = ProjectsManager;
