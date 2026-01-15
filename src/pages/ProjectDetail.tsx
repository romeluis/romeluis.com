import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { ProjectDetail as ProjectDetailType, ProjectDetailAPIResponse } from '../structures/ProjectInformation';
import ComponentRenderer from '../components/projects/ComponentRenderer';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.romeluis.com/api/projects/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }
        
        const result: ProjectDetailAPIResponse = await response.json();
        
        if (result.success) {
          setProject(result.data);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail">
        <div className="project-detail__container">
          <div className="project-detail__skeleton">
            {/* Back button skeleton */}
            <div className="skeleton-back-button shimmer-load" />

            {/* Header skeleton */}
            <div className="skeleton-header">
              <div className="skeleton-title shimmer-load" />
              <div className="skeleton-subtitle shimmer-load" />
              <div className="skeleton-dates shimmer-load" />
            </div>

            {/* Content skeleton - mimics typical project layout */}
            <div className="skeleton-content">
              <div className="skeleton-about shimmer-load" />
              <div className="skeleton-image shimmer-load" />
              <div className="skeleton-text-block shimmer-load" />
              <div className="skeleton-tech-stack shimmer-load" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail">
        <div className="project-detail__container">
          <div className="project-detail__error">
            <h2 className="project-detail__error-title">Error</h2>
            <p className="project-detail__error-message">
              {error || 'Project not found'}
            </p>
            <Link to="/projects" className="project-detail__back-link">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sort components by display_order
  const sortedComponents = [...project.components].sort(
    (a, b) => a.display_order - b.display_order
  );

  // Find title component for header display
  const titleComponent = project.components.find(c => c.component_type === 'title');
  const displayTitle = titleComponent?.component_data?.title || project.name;
  const displaySubtitle = titleComponent?.component_data?.subtitle || project.subheading;

  return (
    <div className="project-detail">
      <div className="project-detail__container">
        <button
          className="project-detail__back-button"
          onClick={() => navigate('/projects')}
        >
          <img 
            src="/Back Arrow.svg" 
            alt="" 
            className="project-detail__back-icon"
          />
          Back
        </button>

        <div className="project-detail__header">
          <h1 className="project-detail__title">{displayTitle}</h1>
          {displaySubtitle && (
            <p className="project-detail__subheading">{displaySubtitle}</p>
          )}
          <div className="project-detail__metadata">
            <span className="project-detail__dates">
              {new Date(project.date_started).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
              {project.date_ended && (
                <> - {new Date(project.date_ended).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}</>
              )}
            </span>
          </div>
        </div>

        <div className="project-detail__content">
          {sortedComponents.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              project={project}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
