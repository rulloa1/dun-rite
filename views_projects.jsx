/* Projects Manager — Create, Edit, Switch Projects
   Reads/writes through window.DROS (store.js) so all project data
   lives in the main store and participates in Firebase Realtime sync
   once credentials are configured in os/sync-config.js.
   dr_active_project in localStorage is kept as a lightweight UI pref.
*/

function ProjectsManager() {
  const getProjects = () => (window.DROS && DROS.state.projects) ? [...DROS.state.projects] : [];

  const [projects, setProjects] = React.useState(getProjects);
  const [viewMode, setViewMode] = React.useState('list');
  const [selectedProjectId, setSelectedProjectId] = React.useState(() =>
    localStorage.getItem('dr_active_project') || (getProjects()[0]?.id || null)
  );
  const [formData, setFormData] = React.useState({
    name: '', location: '', client: '', projectNumber: '',
    status: 'active', startDate: '', completionDate: '',
    budget: 0, description: '', manager: ''
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  /* Subscribe to DROS so adds/edits/deletes from any view refresh the list */
  React.useEffect(() => {
    if (!window.DROS) return;
    const unsub = DROS.subscribe(st => setProjects([...st.projects]));
    return unsub;
  }, []);

  /* Sync active project badge from cross-tab storage events */
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'dr_active_project') setSelectedProjectId(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleCreateNew = () => {
    setFormData({ name:'', location:'', client:'', projectNumber:'',
      status:'active', startDate:'', completionDate:'', budget:0, description:'', manager:'' });
    setViewMode('create');
  };

  const handleEdit = (project) => {
    setFormData({
      name:           project.name           || '',
      location:       project.location       || '',
      client:         project.client         || '',
      projectNumber:  project.projectNumber  || '',
      status:         project.status || project.stage || 'active',
      startDate:      project.startDate      || '',
      completionDate: project.completionDate || project.due || '',
      budget:         project.budget || project.contract || 0,
      description:    project.description    || '',
      manager:        project.manager || project.pm || '',
    });
    setSelectedProjectId(project.id);
    setViewMode('edit');
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('Project name and location are required');
      return;
    }
    const user = (window.DROS && DROS.state.user) ? DROS.state.user : { initials: '—' };

    if (viewMode === 'create') {
      const p = DROS.actions.addProject({ ...formData, id: 'proj-' + Date.now() }, user);
      setSelectedProjectId(p.id);
      localStorage.setItem('dr_active_project', p.id);
      window.dispatchEvent(new StorageEvent('storage', { key: 'dr_active_project', newValue: p.id }));
      setViewMode('list');
    } else {
      DROS.actions.updateProject(selectedProjectId, formData, user);
      setViewMode('list');
    }
  };

  const handleDelete = (projectId) => {
    if (confirm('Delete this project? This cannot be undone.')) {
      const user = (window.DROS && DROS.state.user) ? DROS.state.user : { initials: '—' };
      DROS.actions.deleteProject(projectId, user);
      if (selectedProjectId === projectId) {
        const remaining = DROS.state.projects;
        const next = remaining[0]?.id || '';
        setSelectedProjectId(next);
        localStorage.setItem('dr_active_project', next);
        window.dispatchEvent(new StorageEvent('storage', { key: 'dr_active_project', newValue: next }));
      }
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('dr_active_project', projectId);
    window.dispatchEvent(new StorageEvent('storage', { key: 'dr_active_project', newValue: projectId }));
    window.location.reload();
  };

  const filteredProjects = projects.filter(p =>
    (p.name     || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.client   || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const usd = (n) => '$' + Math.round(+n || 0).toLocaleString('en-US');

  // ---- List View ----
  const ListView = () => React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'page-head' },
      React.createElement('div', null,
        React.createElement('h1', null, 'Projects'),
        React.createElement('div', { className: 'sub' },
          React.createElement('span', { className: 'chip' }, 'Manage all construction projects')
        )
      ),
      React.createElement('button', { className: 'btn btn--primary', onClick: handleCreateNew }, '+ New Project')
    ),

    React.createElement('div', { className: 'card tablecard' },
      React.createElement('div', { className: 'card__h' },
        React.createElement('h3', null, 'All Projects (' + filteredProjects.length + ')'),
        React.createElement('input', {
          type: 'text', placeholder: 'Search...', value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: { padding:'8px 12px', border:'1px solid var(--line)', borderRadius:'4px', fontSize:'13px', width:'200px' }
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
              React.createElement('td', null, project.location || project.phase || '—'),
              React.createElement('td', null, project.client   || project.pm   || '—'),
              React.createElement('td', null, usd(project.budget || project.contract)),
              React.createElement('td', null,
                React.createElement('span', {
                  className: 'pill pill--' + (project.status || project.stage || 'active').toLowerCase()
                }, project.status || project.stage || 'Active')
              ),
              React.createElement('td', null,
                React.createElement('div', { style: { display: 'flex', gap: 6 } },
                  React.createElement('button', {
                    className: 'btn btn--sm',
                    onClick: () => handleSelectProject(project.id)
                  }, selectedProjectId === project.id ? '✓ Active' : 'Activate'),
                  React.createElement('button', { className: 'btn btn--sm', onClick: () => handleEdit(project) }, 'Edit'),
                  React.createElement('button', { className: 'btn btn--sm btn--danger', onClick: () => handleDelete(project.id) }, 'Delete')
                )
              )
            )
          )
        )
      )
    )
  );

  // ---- Form View ----
  const field = (label, input) =>
    React.createElement('div', null,
      React.createElement('label', { style:{fontSize:12,fontWeight:600,color:'var(--muted)',textTransform:'uppercase'} }, label),
      input
    );
  const inp = (type, key, placeholder, extra={}) =>
    React.createElement('input', {
      type, value: formData[key], placeholder,
      onChange: (e) => setFormData({...formData, [key]: type==='number' ? parseFloat(e.target.value)||0 : e.target.value}),
      style:{width:'100%',padding:'10px 12px',border:'1px solid var(--line)',borderRadius:'4px',marginTop:6},
      ...extra
    });

  const FormView = () => React.createElement('div', { className: 'page' },
    React.createElement('div', { className: 'page-head' },
      React.createElement('h1', null, viewMode === 'create' ? 'New Project' : 'Edit Project'),
      React.createElement('button', { className: 'btn', onClick: () => setViewMode('list') }, 'Cancel')
    ),

    React.createElement('div', { className: 'card', style: { maxWidth: '800px' } },
      React.createElement('div', { style: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 } },
        field('Project Name',   inp('text',   'name',          'e.g., Longleaf Amenity Center')),
        field('Project Number', inp('text',   'projectNumber', 'e.g., BP-2026-014')),
        field('Location',       inp('text',   'location',      'e.g., San Antonio, TX')),
        field('Client',         inp('text',   'client',        'e.g., Longleaf Development')),
        field('Budget',         inp('number', 'budget',        '1350000')),
        field('Project Manager',inp('text',   'manager',       'e.g., Michael E. Chandler')),
        field('Start Date',     inp('date',   'startDate',     '')),
        field('Completion Date',inp('date',   'completionDate','')),
        field('Status',
          React.createElement('select', {
            value: formData.status,
            onChange: (e) => setFormData({...formData, status: e.target.value}),
            style:{width:'100%',padding:'10px 12px',border:'1px solid var(--line)',borderRadius:'4px',marginTop:6}
          },
            React.createElement('option', {value:'planning'},  'Planning'),
            React.createElement('option', {value:'active'},    'Active'),
            React.createElement('option', {value:'paused'},    'Paused'),
            React.createElement('option', {value:'completed'}, 'Completed'),
            React.createElement('option', {value:'archived'},  'Archived')
          )
        )
      ),

      React.createElement('div', { style:{ marginTop:20 } },
        React.createElement('label', { style:{fontSize:12,fontWeight:600,color:'var(--muted)',textTransform:'uppercase',display:'block'} }, 'Description'),
        React.createElement('textarea', {
          value: formData.description,
          onChange: (e) => setFormData({...formData, description: e.target.value}),
          placeholder: 'Project details and scope...', rows: 4,
          style:{width:'100%',padding:'10px 12px',border:'1px solid var(--line)',borderRadius:'4px',marginTop:6,fontFamily:'inherit'}
        })
      ),

      React.createElement('div', { style:{ display:'flex', gap:12, marginTop:24, justifyContent:'flex-end' } },
        React.createElement('button', { className:'btn', onClick:()=>setViewMode('list') }, 'Cancel'),
        React.createElement('button', { className:'btn btn--primary', onClick:handleSave },
          viewMode === 'create' ? 'Create Project' : 'Save Changes')
      )
    )
  );

  return React.createElement(React.Fragment, null,
    viewMode === 'list' && React.createElement(ListView),
    (viewMode === 'create' || viewMode === 'edit') && React.createElement(FormView)
  );
}

window.ProjectsManager = ProjectsManager;
