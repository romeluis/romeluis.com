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
    type: 'sections' | 'entries' | 'bullets',
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
}

export const dbClient = new DatabaseClient();
