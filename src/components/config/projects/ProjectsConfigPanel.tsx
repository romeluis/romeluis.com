import { useState, useEffect } from 'react';
import './ProjectsConfigPanel.css';
import type { ProjectsData } from '../utils/types';
import { dbClient } from '../utils/dbClient';
import Spinner from '../shared/Spinner';
import ErrorMessage from '../shared/ErrorMessage';
import ProjectsList from './ProjectsList';

function ProjectsConfigPanel() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (showSpinner = false) => {
    try {
      if (showSpinner) {
        setLoading(true);
      }
      setError(null);
      const data = await dbClient.getProjectsData();
      setProjectsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects data');
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData(true);
  }, []);

  if (loading) {
    return (
      <div className="projects-config-panel">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-config-panel">
        <ErrorMessage message={error} onRetry={() => loadData(true)} />
      </div>
    );
  }

  if (!projectsData) {
    return (
      <div className="projects-config-panel">
        <ErrorMessage message="No projects data found" onRetry={() => loadData(true)} />
      </div>
    );
  }

  return (
    <div className="projects-config-panel">
      <h2>Projects Configuration</h2>

      <ProjectsList
        projects={projectsData.projects}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default ProjectsConfigPanel;
