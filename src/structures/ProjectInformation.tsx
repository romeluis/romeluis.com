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
