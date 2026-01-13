import { useEffect, useState } from 'react';
import type { Project, ProjectsAPIResponse } from '../../structures/ProjectInformation';
import ProjectCard from './ProjectCard';
import './ProjectBrowser.css';

function ProjectBrowser() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.romeluis.com/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const result: ProjectsAPIResponse = await response.json();
        if (result.success) {
          setProjects(result.data.projects);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="projects-container">
        <div className="projects-content">
          <div className="projects-loading-skeleton">
            <div className="shimmer-load">
              <h1>Browse Projects</h1>
            </div>
            <div className="skeleton-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="shimmer-load skeleton-project-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="projects-error">Error: {error}</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="projects-container">
        <div className="projects-empty">No projects available</div>
      </div>
    );
  }

  // Sort projects: pinned first, then by date (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
    // Primary sort: is_pinned (true first)
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }
    // Secondary sort: date_started (descending - newest first)
    return new Date(b.date_started).getTime() - new Date(a.date_started).getTime();
  });

  return (
    <div className="projects-container">
      <div className="projects-content">
        <h1>Browse Projects</h1>
        <div className="projects-grid">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectBrowser;
