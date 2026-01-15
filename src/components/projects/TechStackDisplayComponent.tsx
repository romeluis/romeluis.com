import React from 'react';
import type { TechStackItem } from '../../structures/ProjectInformation';
import './TechStackDisplayComponent.css';

interface TechStackDisplayComponentProps {
  techStack: TechStackItem[];
}

const TechStackDisplayComponent: React.FC<TechStackDisplayComponentProps> = ({ techStack }) => {
  if (!techStack || techStack.length === 0) {
    return null;
  }

  // Sort by display_order
  const sortedTechStack = [...techStack].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="tech-stack-display">
      <h3 className="tech-stack-display__title">Tech Stack</h3>
      <div className="tech-stack-display__grid">
        {sortedTechStack.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="tech-stack-display__item"
            title={tech.name}
          >
            {tech.image_url ? (
              <img
                src={tech.image_url}
                alt={tech.name}
                className="tech-stack-display__image"
              />
            ) : (
              <div 
                className="tech-stack-display__placeholder"
                style={tech.color ? { backgroundColor: tech.color } : undefined}
              >
                {tech.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackDisplayComponent;
