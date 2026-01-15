import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../structures/ProjectInformation';
import PinIndicator from './PinIndicator';
import TechStackBadge from './TechStackBadge';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  // Get the top tech stack item
  const topTech = project.tech_stack[0];

  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card"
      aria-label={`View ${project.name} project`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={project.poster_image_url || ''}
        alt={project.name}
        className="project-card-image"
      />
      <PinIndicator isPinned={project.is_pinned} />
      {topTech && (
        <TechStackBadge
          techName={topTech.name}
          techColor={topTech.color}
          projectId={project.id}
          isParentHovered={isHovered}
        />
      )}
      <div className="project-card-overlay">
        <div className="project-card-title">{project.name}</div>
        {project.subheading && (
          <div className="project-card-subheading">{project.subheading}</div>
        )}
      </div>
    </Link>
  );
}

export default ProjectCard;
