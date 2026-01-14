import { useState } from 'react';
import './TagsList.css';
import type { ProjectTag } from '../utils/types';
import Button from '../shared/Button';
import ConfirmDialog from '../shared/ConfirmDialog';
import { dbClient } from '../utils/dbClient';

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
      await dbClient.createTag(projectId, { tag: newTagName.trim() });
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
            <div key={tag.id} className="tag-chip">
              <span className="tag-name">{tag.tag}</span>
              <button type="button" onClick={() => handleDelete(tag)} className="delete-btn">
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
        message={`Are you sure you want to delete the tag "${deletingTag?.tag}"?`}
        confirmText="Delete"
      />
    </div>
  );
}

export default TagsList;
