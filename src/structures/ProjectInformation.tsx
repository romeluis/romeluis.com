export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

export interface Project {
  id: number;
  name: string;
  subheading: string | null;
  date_started: string;
  date_ended: string | null;
  is_pinned: boolean;
  poster_image_url: string | null;
  tags: Tag[];
  tech_stack: TechStackItem[];
}

export interface TechStackItem {
  name: string;
  display_order: number;
  color?: string | null;
  image_url?: string | null;
}

export interface ProjectsAPIResponse {
  success: boolean;
  data: {
    projects: Project[];
    count: number;
  };
}

export type SortOption =
  | 'date-newest'
  | 'date-oldest'
  | 'name-asc'
  | 'name-desc';

export interface FilterState {
  isPinned: 'all' | 'pinned' | 'unpinned';
  startDateFrom?: string;
  startDateTo?: string;
}

// Component types for project detail pages
export type ComponentType =
  | 'title'
  | 'about'
  | 'tech_stack'
  | 'image_carousel'
  | 'text'
  | 'text_with_title'
  | 'video'
  | 'text_with_image'
  | 'text_image_title'
  | 'single_image'
  | 'repository_links'
  | 'related_projects'
  | 'mermaid';

export interface ProjectComponent {
  id: number;
  component_type: ComponentType;
  component_data: Record<string, any>;
  display_order: number;
}

export interface ProjectDetail extends Project {
  color: string | null;
  components: ProjectComponent[];
}

export interface ProjectDetailAPIResponse {
  success: boolean;
  data: ProjectDetail; // API returns project directly under 'data'
}
