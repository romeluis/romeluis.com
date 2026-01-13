import { Link } from 'react-router-dom';
import type { Project } from '../../structures/ProjectInformation';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="project-card"
      aria-label={`View ${project.name} project`}
    >
      <img
        src={project.poster_image_url || ''}
        alt={project.name}
        className="project-card-image"
      />
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
