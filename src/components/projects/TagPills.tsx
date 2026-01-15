import './TagPills.css';
import type { Tag } from '../../structures/ProjectInformation';
import { useState } from 'react';

interface TagPillsProps {
  tags: Tag[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

function TagPills({ tags, activeTag, onTagSelect }: TagPillsProps) {
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  if (tags.length === 0) return null;

  const handleTagClick = (tagName: string) => {
    if (activeTag === tagName) {
      onTagSelect(null);
    } else {
      onTagSelect(tagName);
    }
  };

  const getTagStyle = (tag: Tag, isActive: boolean, isHovered: boolean) => {
    const hasColor = !!tag.color;

    if (isActive && hasColor) {
      // Active with color: fill with color, white text
      return {
        backgroundColor: tag.color!,
        borderColor: tag.color!,
        color: '#ffffff',
      };
    } else if (isActive && !hasColor) {
      // Active without color: use default black background
      return {
        backgroundColor: 'var(--color-ui-black)',
        borderColor: 'var(--color-ui-black)',
        color: 'var(--color-ui-white)',
      };
    } else if (isHovered && hasColor) {
      // Hover with color: fill with color, white text
      return {
        backgroundColor: tag.color!,
        borderColor: tag.color!,
        color: '#ffffff',
      };
    } else if (hasColor) {
      // Default with color: white background, colored border
      return {
        backgroundColor: 'var(--color-ui-white)',
        borderColor: tag.color!,
        color: 'var(--color-ui-black)',
      };
    } else {
      // Default without color: standard styling
      return {
        backgroundColor: 'var(--color-ui-white)',
        borderColor: 'var(--color-ui-black)',
        color: 'var(--color-ui-black)',
      };
    }
  };

  return (
    <div className="tag-pills-container">
      <div className="tag-pills">
        {tags.map((tag) => {
          const isActive = activeTag === tag.name;
          const isHovered = hoveredTag === tag.id;

          return (
            <button
              key={tag.id}
              className="tag-pill"
              onClick={() => handleTagClick(tag.name)}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              aria-pressed={isActive}
              style={getTagStyle(tag, isActive, isHovered)}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TagPills;
