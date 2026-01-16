import type {
  ResumeData,
  BasicInfoFormData,
  SectionFormData,
  EntryFormData,
  BulletFormData,
  ReorderItem,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.romeluis.com/api';
const ADMIN_API_BASE = 'http://localhost:3001/api/admin';

class DatabaseClient {
  // Read operations (using existing API)
  async getResumeData(): Promise<ResumeData> {
    const response = await fetch(`${API_BASE}/resume`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch resume data');
    }

    // Transform snake_case API response to camelCase
    return {
      basicInfo: data.data.basic_info,
      sections: data.data.sections,
    };
  }

  // Write operations (using local admin server)
  async updateBasicInfo(data: BasicInfoFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/basic-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update basic info');
    }
  }

  async createSection(data: SectionFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create section');
    }

    return result.id;
  }

  async updateSection(id: number, data: SectionFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/sections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update section');
    }
  }

  async deleteSection(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/sections/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete section');
    }
  }

  async createEntry(sectionId: number, data: EntryFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section_id: sectionId, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create entry');
    }

    return result.id;
  }

  async updateEntry(id: number, data: EntryFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update entry');
    }
  }

  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/entries/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete entry');
    }
  }

  async createBullet(entryId: number, data: BulletFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/bullets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create bullet');
    }

    return result.id;
  }

  async updateBullet(id: number, data: BulletFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/bullets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update bullet');
    }
  }

  async deleteBullet(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/bullets/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete bullet');
    }
  }

  async reorderItems(
    type: 'sections' | 'entries' | 'bullets' | 'projects' | 'tech_stack' | 'components',
    items: ReorderItem[]
  ): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/resume/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, items }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to reorder items');
    }
  }

  // Project methods
  async getProjectsData(): Promise<import('./types').ProjectsData> {
    // Use admin endpoint to get full tag/tech details
    const response = await fetch(`${ADMIN_API_BASE}/projects`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch projects data');
    }

    return { projects: data.data.projects };
  }

  async uploadImage(imageData: string, filename: string): Promise<string> {
    const response = await fetch(`${ADMIN_API_BASE}/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData, filename }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload image');
    }

    return result.url;
  }

  async uploadMedia(mediaData: string, filename: string): Promise<{ url: string; mediaType: 'image' | 'video' }> {
    const response = await fetch(`${ADMIN_API_BASE}/upload-media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media: mediaData, filename }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload media');
    }

    return { url: result.url, mediaType: result.mediaType };
  }

  async createProject(data: import('./types').ProjectFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create project');
    }

    return result.id;
  }

  async updateProject(id: number, data: import('./types').ProjectFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update project');
    }
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete project');
    }
  }

  async createTechStackItem(projectId: number, data: import('./types').TechStackFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tech-stack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create tech stack item');
    }

    return result.id;
  }

  async updateTechStackItem(techId: number, color: string | null, imageUrl: string | null): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tech-stack/${techId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color, image_url: imageUrl }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update tech stack item');
    }
  }

  async deleteTechStackItem(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tech-stack/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete tech stack item');
    }
  }

  async getAllTechStack(): Promise<Array<{id: number; name: string; color: string | null; image_url: string | null}>> {
    const response = await fetch(`${ADMIN_API_BASE}/tech-stack`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch tech stack');
    }
    return data.data;
  }

  async getTechUsageCount(techId: number): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/tech-stack/${techId}/usage`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch usage count');
    }
    return data.count;
  }

  async getTechProjects(techId: number): Promise<Array<{id: number; name: string}>> {
    const response = await fetch(`${ADMIN_API_BASE}/tech-stack/${techId}/projects`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch projects');
    }
    return data.data;
  }

  async updateMasterTech(techId: number, data: { name: string; color: string | null; image_url: string | null }): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/tech-stack/${techId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update tech');
    }
  }

  async deleteMasterTech(techId: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/tech-stack/${techId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete tech');
    }
  }

  async createTag(projectId: number, data: import('./types').TagFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create tag');
    }

    return result.id;
  }

  async updateTag(id: number, color: string | null): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update tag');
    }
  }

  async deleteTag(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/tags/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete tag');
    }
  }

  async createComponent(projectId: number, data: import('./types').ComponentFormData): Promise<number> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, ...data }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create component');
    }

    return result.id;
  }

  async updateComponent(id: number, data: import('./types').ComponentFormData): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/components/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update component');
    }
  }

  async deleteComponent(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API_BASE}/projects/components/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete component');
    }
  }
}

export const dbClient = new DatabaseClient();
