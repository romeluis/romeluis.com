export interface Project {
  id: number;
  name: string;
  subheading: string | null;
  date_started: string;
  date_ended: string | null;
  is_pinned: boolean;
  poster_image_url: string | null;
  tags: string[];
  tech_stack: TechStackItem[];
}

export interface TechStackItem {
  name: string;
  display_order: number;
}

export interface ProjectsAPIResponse {
  success: boolean;
  data: {
    projects: Project[];
    count: number;
  };
}
