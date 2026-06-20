/* Projects Manager - Data Model & CRUD */

window.ProjectsManager = (function(){
  
  // Project template
  const createProject = (name, overrides = {}) => ({
    id: 'PROJ-' + Date.now(),
    name: name || 'New Project',
    client: overrides.client || '',
    location: overrides.location || '',
    address: overrides.address || '',
    startDate: overrides.startDate || new Date().toISOString().split('T')[0],
    endDate: overrides.endDate || '',
    budget: overrides.budget || 0,
    status: overrides.status || 'planning', // planning, active, on-hold, completed, archived
    pm: overrides.pm || '',
    description: overrides.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    team: overrides.team || [],
    trades: overrides.trades || [],
    bids: overrides.bids || [],
    contracts: overrides.contracts || [],
    schedule: overrides.schedule || null,
    photos: overrides.photos || [],
    documents: overrides.documents || [],
    notes: overrides.notes || '',
    color: overrides.color || '#1DB4E8' // cyan by default
  });

  // Local storage key
  const STORAGE_KEY = 'dunrite_projects';
  const ACTIVE_PROJECT_KEY = 'dunrite_active_project';

  // Get all projects from localStorage
  const getProjects = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading projects:', e);
      return [];
    }
  };

  // Save projects to localStorage
  const saveProjects = (projects) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (e) {
      console.error('Error saving projects:', e);
      return false;
    }
  };

  // Create new project
  const createNewProject = (name, details = {}) => {
    const projects = getProjects();
    const newProject = createProject(name, details);
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
  };

  // Update project
  const updateProject = (projectId, updates) => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      saveProjects(projects);
      return projects[index];
    }
    return null;
  };

  // Delete project
  const deleteProject = (projectId) => {
    const projects = getProjects().filter(p => p.id !== projectId);
    saveProjects(projects);
    if (getActiveProject() === projectId) {
      setActiveProject(projects[0]?.id || null);
    }
  };

  // Get single project
  const getProject = (projectId) => {
    const projects = getProjects();
    return projects.find(p => p.id === projectId);
  };

  // Set active project
  const setActiveProject = (projectId) => {
    localStorage.setItem(ACTIVE_PROJECT_KEY, projectId || '');
  };

  // Get active project
  const getActiveProject = () => {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  };

  // Get active project full object
  const getActiveProjectData = () => {
    const activeId = getActiveProject();
    if (!activeId) return getProjects()[0] || null;
    return getProject(activeId);
  };

  // Add team member to project
  const addTeamMember = (projectId, member) => {
    const project = getProject(projectId);
    if (project) {
      if (!project.team) project.team = [];
      project.team.push({
        id: 'TM-' + Date.now(),
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        addedAt: new Date().toISOString()
      });
      updateProject(projectId, project);
      return project;
    }
    return null;
  };

  // Add trade to project
  const addTrade = (projectId, trade) => {
    const project = getProject(projectId);
    if (project) {
      if (!project.trades) project.trades = [];
      project.trades.push({
        id: 'TRADE-' + Date.now(),
        name: trade.name,
        budget: trade.budget || 0,
        subcontractor: trade.subcontractor || '',
        status: 'pending'
      });
      updateProject(projectId, project);
      return project;
    }
    return null;
  };

  return {
    createProject,
    getProjects,
    saveProjects,
    createNewProject,
    updateProject,
    deleteProject,
    getProject,
    setActiveProject,
    getActiveProject,
    getActiveProjectData,
    addTeamMember,
    addTrade,
    STORAGE_KEY,
    ACTIVE_PROJECT_KEY
  };
})();
