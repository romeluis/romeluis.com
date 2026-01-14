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
