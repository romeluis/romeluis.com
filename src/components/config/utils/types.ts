// Resume data types matching the database schema

export interface BasicInfo {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  location: string | null;
  summary: string | null;
}

export interface Bullet {
  id: number;
  entry_id: number;
  content: string;
  display_order: number;
}

export interface Entry {
  id: number;
  section_id: number;
  title: string;
  subtitle: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  display_order: number;
  bullets: Bullet[];
}

export interface Section {
  id: number;
  title: string;
  section_type: string;
  display_order: number;
  is_visible: boolean;
  entries: Entry[];
}

export interface ResumeData {
  basicInfo: BasicInfo;
  sections: Section[];
}

// Form data types (for creating/updating)
export interface BasicInfoFormData {
  full_name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  location: string;
  summary: string;
}

export interface SectionFormData {
  title: string;
  section_type: string;
  is_visible: boolean;
}

export interface EntryFormData {
  title: string;
  subtitle: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
}

export interface BulletFormData {
  content: string;
}

// Editing state types
export type EditingState =
  | { type: 'basic_info' }
  | { type: 'section'; id: number | null }
  | { type: 'entry'; sectionId: number; id: number | null }
  | { type: 'bullet'; entryId: number; id: number | null };

// Reorder types
export interface ReorderItem {
  id: number;
  display_order: number;
}

// Project data types matching the database schema

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
  | 'repository_links'
  | 'related_projects';

export interface ProjectComponent {
  id: number;
  project_id: number;
  component_type: ComponentType;
  component_data: Record<string, any>;
  display_order: number;
}

export interface TechStackItem {
  id: number;              // Junction table id (for delete/reorder)
  tech_id: number;         // Master table id (for property updates)
  name: string;
  display_order: number;
  color: string | null;
  image_url: string | null;
}

export interface ProjectTag {
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
  display_order: number;
  poster_image_url: string | null;
  tech_stack: TechStackItem[];
  tags: ProjectTag[];
  components: ProjectComponent[];
}

export interface ProjectsData {
  projects: Project[];
}

// Project form data types
export interface ProjectFormData {
  name: string;
  subheading: string;
  date_started: string;
  date_ended: string;
  is_pinned: boolean;
  poster_image_url: string;
}

export interface TechStackFormData {
  name: string;
  color?: string | null;
  image_url?: string | null;
}

export interface TagFormData {
  tag_name: string;
}

export interface ComponentFormData {
  component_type: ComponentType;
  component_data: Record<string, any>;
}
