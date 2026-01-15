import { useState } from 'react';
import type { SortOption, Tag } from '../../structures/ProjectInformation';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import TagPills from './TagPills';
import './ProjectToolbar.css';

interface ProjectToolbarProps {
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sortOption: SortOption) => void;
  currentSearch: string;
  currentSort: SortOption;
  availableTags: Tag[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

function ProjectToolbar({
  onSearchChange,
  onSortChange,
  currentSearch,
  currentSort,
  availableTags,
  selectedTag,
  onTagSelect,
}: ProjectToolbarProps) {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);

  const handleSortToggle = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const getSortLabel = (sortOption: SortOption): string => {
    switch (sortOption) {
      case 'date-newest':
        return 'Date (Newest)';
      case 'date-oldest':
        return 'Date (Oldest)';
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      default:
        return 'Sort';
    }
  };

  return (
    <div className="project-toolbar">
      <div className="project-toolbar-buttons">
        <div className="project-toolbar-button-wrapper">
          <button
            className={`project-toolbar-button ${isSortDropdownOpen ? 'project-toolbar-button-active' : ''}`}
            onClick={handleSortToggle}
            aria-expanded={isSortDropdownOpen}
            aria-label={`Sort projects by ${getSortLabel(currentSort)}`}
          >
            <img
              src="/Sort Symbol.svg"
              alt=""
              className="project-toolbar-icon"
              aria-hidden="true"
            />
          </button>
          <SortDropdown
            currentSort={currentSort}
            onChange={onSortChange}
            isOpen={isSortDropdownOpen}
            onClose={() => setIsSortDropdownOpen(false)}
          />
        </div>

        <SearchBar value={currentSearch} onChange={onSearchChange} />
      </div>

      <TagPills tags={availableTags} activeTag={selectedTag} onTagSelect={onTagSelect} />
    </div>
  );
}

export default ProjectToolbar;
