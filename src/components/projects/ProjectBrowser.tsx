import { useEffect, useState, useMemo } from 'react';
import type { Project, ProjectsAPIResponse, FilterState, SortOption, Tag } from '../../structures/ProjectInformation';
import { useDebounce } from '../../hooks/useDebounce';
import ProjectCard from './ProjectCard';
import ProjectToolbar from './ProjectToolbar';
import './ProjectBrowser.css';

function ProjectBrowser() {
  // API data state
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User controls state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    isPinned: 'all',
  });
  const [sortOption, setSortOption] = useState<SortOption>('date-newest');

  // Debounce search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Build API URL based on filters and search
  const buildApiUrl = (
    search: string,
    tag: string | null,
    filterState: FilterState
  ): string => {
    const params = new URLSearchParams();

    if (search) params.append('name', search);
    if (tag) params.append('tag', tag);
    if (filterState.isPinned === 'pinned') params.append('isPinned', 'true');
    if (filterState.isPinned === 'unpinned') params.append('isPinned', 'false');

    return params.toString()
      ? `https://api.romeluis.com/api/projects?${params}`
      : 'https://api.romeluis.com/api/projects';
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      // Only show skeleton loader on initial load
      if (isInitialLoad) {
        setLoading(true);
      }

      try {
        const apiUrl = buildApiUrl(debouncedSearchTerm, selectedTag, filters);
        const response = await fetch(apiUrl);
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
        if (isInitialLoad) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchProjects();
  }, [debouncedSearchTerm, selectedTag, filters, isInitialLoad]);

  // Front-end search filtering for tags and tech stack
  const searchProjects = (projectList: Project[], search: string): Project[] => {
    if (!search) return projectList;
    const lowerSearch = search.toLowerCase();

    return projectList.filter((project) => {
      const nameMatch = project.name.toLowerCase().includes(lowerSearch);
      const tagMatch = project.tags.some((tag) => tag.name.toLowerCase().includes(lowerSearch));
      const techMatch = project.tech_stack.some((tech) =>
        tech.name.toLowerCase().includes(lowerSearch)
      );
      return nameMatch || tagMatch || techMatch;
    });
  };

  // Sort projects based on sort option
  const sortProjects = (projectList: Project[], sort: SortOption): Project[] => {
    const sorted = [...projectList];

    switch (sort) {
      case 'date-newest':
        return sorted.sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
          return new Date(b.date_started).getTime() - new Date(a.date_started).getTime();
        });

      case 'date-oldest':
        return sorted.sort(
          (a, b) => new Date(a.date_started).getTime() - new Date(b.date_started).getTime()
        );

      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));

      default:
        return sorted;
    }
  };

  // Extract unique tags from projects
  const availableTags = useMemo(() => {
    if (!projects) return [];
    const tagMap = new Map<number, Tag>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagMap.set(tag.id, tag));
    });
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  // Apply search and sort to projects
  const processedProjects = useMemo(() => {
    if (!projects) return [];
    let result = searchProjects(projects, debouncedSearchTerm);
    result = sortProjects(result, sortOption);
    return result;
  }, [projects, debouncedSearchTerm, sortOption]);

  // Check if there are active filters
  const hasActiveFilters = filters.isPinned !== 'all';

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Handle search changes
  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  // Handle sort changes
  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
    setFilters({ isPinned: 'all' });
    setSortOption('date-newest');
  };

  if (loading) {
    return (
      <div className="projects-container">
        <div className="projects-content">
          <div className="projects-loading-skeleton">
            <div className="shimmer-load skeleton-title"></div>
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

  const hasFiltersOrSearch = searchTerm || selectedTag || hasActiveFilters;
  const noResults = processedProjects.length === 0;

  return (
    <div className="projects-container">
      <div className="projects-content">
        <h1>Browse Projects</h1>
        <ProjectToolbar
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          currentSearch={searchTerm}
          currentSort={sortOption}
          availableTags={availableTags}
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
        />

        {noResults && hasFiltersOrSearch ? (
          <div className="projects-empty-filtered">
            <p>No projects match your current filters</p>
            <button className="clear-filters-button" onClick={handleClearAllFilters}>
              Clear All Filters
            </button>
          </div>
        ) : noResults ? (
          <div className="projects-empty">No projects available</div>
        ) : (
          <div className="projects-grid">
            {processedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectBrowser;
