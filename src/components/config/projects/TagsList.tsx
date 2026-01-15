import { useState } from 'react';
import './TagsList.css';
import type { ProjectTag } from '../utils/types';
import Button from '../shared/Button';
import ConfirmDialog from '../shared/ConfirmDialog';
import { dbClient } from '../utils/dbClient';

// Predefined color palette from global.css
const TAG_COLORS = [
  { name: 'Green', value: '#91bf4b' },
  { name: 'Yellow', value: '#ffd05d' },
  { name: 'Orange', value: '#f26a2d' },
  { name: 'Pink', value: '#f96ba4' },
  { name: 'Blue', value: '#02a6ff' },
  { name: 'Black', value: '#120e14' },
  { name: 'Gray', value: '#afafaf' },
];

interface TagsListProps {
  projectId: number;
  tags: ProjectTag[];
  onRefresh: () => Promise<void>;
}

function TagsList({ projectId, tags, onRefresh }: TagsListProps) {
  const [newTagName, setNewTagName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingTag, setDeletingTag] = useState<ProjectTag | null>(null);

  const handleAdd = async () => {
    if (!newTagName.trim()) return;

    try {
      setAdding(true);
      await dbClient.createTag(projectId, { tag_name: newTagName.trim() });
      setNewTagName('');
      await onRefresh();
    } catch (error) {
      console.error('Failed to add tag:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (tag: ProjectTag) => {
    setDeletingTag(tag);
  };

  const confirmDelete = async () => {
    if (!deletingTag) return;

    try {
      await dbClient.deleteTag(deletingTag.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete tag:', error);
    } finally {
      setDeletingTag(null);
    }
  };

  const handleColorChange = async (tagId: number, color: string) => {
    try {
      await dbClient.updateTag(tagId, color || null);
      await onRefresh();
    } catch (error) {
      console.error('Failed to update tag color:', error);
    }
  };

  return (
    <div className="tags-list">
      <div className="add-tag-form">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add tag..."
          disabled={adding}
        />
        <Button variant="primary" onClick={handleAdd} disabled={adding || !newTagName.trim()}>
          Add
        </Button>
      </div>

      {tags.length > 0 ? (
        <div className="tag-chips">
          {tags.map((tag) => (
            <div key={tag.id} className="tag-chip" style={{ borderLeft: tag.color ? `4px solid ${tag.color}` : '4px solid #ccc' }}>
              <div className="tag-info">
                <span className="tag-name">{tag.name}</span>
                <div className="tag-color-picker">
                  <select
                    value={tag.color || ''}
                    onChange={(e) => handleColorChange(tag.id, e.target.value)}
                    className="color-select"
                    title="Set tag color"
                  >
                    <option value="">No color</option>
                    {TAG_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  {tag.color && (
                    <div
                      className="color-preview"
                      style={{ backgroundColor: tag.color }}
                      title={TAG_COLORS.find(c => c.value === tag.color)?.name || 'Custom'}
                    />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(tag)}
                className="delete-btn"
                aria-label={`Delete ${tag.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">No tags yet.</p>
      )}

      <ConfirmDialog
        isOpen={!!deletingTag}
        onClose={() => setDeletingTag(null)}
        onConfirm={confirmDelete}
        title="Delete Tag"
        message={`Are you sure you want to delete the tag "${deletingTag?.name}"?`}
        confirmText="Delete"
      />
    </div>
  );
}

export default TagsList;
