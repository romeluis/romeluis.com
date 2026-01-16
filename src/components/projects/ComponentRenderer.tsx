import React from 'react';
import type { ProjectComponent, ProjectDetail } from '../../structures/ProjectInformation';
import AboutComponent from './AboutComponent';
import TextComponent from './TextComponent';
import TextWithTitleComponent from './TextWithTitleComponent';
import SingleImageComponent from './SingleImageComponent';
import ImageCarouselComponent from './ImageCarouselComponent';
import TextWithImageComponent from './TextWithImageComponent';
import TechStackDisplayComponent from './TechStackDisplayComponent';
import RepositoryLinksComponent from './RepositoryLinksComponent';
import VideoComponent from './VideoComponent';
import MermaidComponent from './MermaidComponent';

interface ComponentRendererProps {
  component: ProjectComponent;
  project: ProjectDetail;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, project }) => {
  const { component_type, component_data } = component;
  const projectColor = project.color || '#02a6ff';

  switch (component_type) {
    case 'about':
      return <AboutComponent text={component_data.text} color={projectColor} />;
    
    case 'text':
      return <TextComponent text={component_data.text} color={projectColor} />;
    
    case 'text_with_title':
      return (
        <TextWithTitleComponent
          title={component_data.title}
          text={component_data.text}
          color={projectColor}
        />
      );
    
    case 'single_image':
      return (
        <SingleImageComponent
          imageUrl={component_data.image_url}
          caption={component_data.caption}
        />
      );
    
    case 'image_carousel':
      return (
        <ImageCarouselComponent
          images={component_data.images || []}
          color={projectColor}
        />
      );
    
    case 'text_with_image':
      return (
        <TextWithImageComponent
          title={component_data.title}
          text={component_data.text}
          imageUrl={component_data.image_url}
          caption={component_data.caption}
          color={projectColor}
          imagePosition={component_data.image_position}
        />
      );

    case 'text_image_title':
      return (
        <TextWithImageComponent
          title={component_data.title}
          text={component_data.text}
          imageUrl={component_data.image_url}
          caption={component_data.caption}
          color={projectColor}
          imagePosition={component_data.image_position}
        />
      );
    
    case 'tech_stack':
      return <TechStackDisplayComponent techStack={project.tech_stack} />;
    
    case 'repository_links':
      return (
        <RepositoryLinksComponent
          githubUrl={component_data.github_url}
          liveUrl={component_data.live_url}
          projectColor={project.color}
        />
      );
    
    case 'title':
      // Title is displayed in ProjectDetail header
      return null;
    
    case 'video':
      return (
        <VideoComponent
          videoUrl={component_data.video_url}
          caption={component_data.caption}
        />
      );

    case 'mermaid':
      return (
        <MermaidComponent
          diagramCode={component_data.diagram_code}
          title={component_data.title}
          caption={component_data.caption}
        />
      );

    case 'related_projects':
      // TODO: Implement related projects component
      return null;

    default:
      console.warn(`Unknown component type: ${component_type}`);
      return null;
  }
};

export default ComponentRenderer;
