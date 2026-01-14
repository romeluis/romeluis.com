import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './BulletsList.css';
import type { Bullet, BulletFormData } from '../utils/types';
import Button from '../shared/Button';
import BulletEditor from './BulletEditor';
import ConfirmDialog from '../shared/ConfirmDialog';
import { dbClient } from '../utils/dbClient';

interface BulletsListProps {
  entryId: number;
  bullets: Bullet[];
  onRefresh: () => Promise<void>;
}

interface SortableItemProps {
  bullet: Bullet;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableItem({ bullet, onEdit, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bullet.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bullet-card">
      <span className="drag-handle" {...attributes} {...listeners}>
        ☰
      </span>
      <div className="bullet-content">{bullet.content}</div>
      <div className="bullet-actions">
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function BulletsList({ entryId, bullets, onRefresh }: BulletsListProps) {
  const [items, setItems] = useState(bullets);
  const [editingBullet, setEditingBullet] = useState<Bullet | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingBullet, setDeletingBullet] = useState<Bullet | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(bullets);
  }, [bullets]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        const reorderData = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }));
        await dbClient.reorderItems('bullets', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder bullets:', error);
        setItems(bullets);
      }
    }
  };

  const handleAddBullet = () => {
    setEditingBullet(null);
    setIsEditorOpen(true);
  };

  const handleEditBullet = (bullet: Bullet) => {
    setEditingBullet(bullet);
    setIsEditorOpen(true);
  };

  const handleDeleteBullet = (bullet: Bullet) => {
    setDeletingBullet(bullet);
  };

  const confirmDelete = async () => {
    if (!deletingBullet) return;

    try {
      await dbClient.deleteBullet(deletingBullet.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete bullet:', error);
    }
  };

  const handleSaveBullet = async (data: BulletFormData) => {
    if (editingBullet) {
      await dbClient.updateBullet(editingBullet.id, data);
    } else {
      await dbClient.createBullet(entryId, data);
    }
    await onRefresh();
  };

  return (
    <div className="bullets-list">
      <div className="bullets-header">
        <h5>Bullets</h5>
        <Button variant="primary" onClick={handleAddBullet}>
          Add Bullet
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="bullets-container">
            {items.map((bullet) => (
              <SortableItem
                key={bullet.id}
                bullet={bullet}
                onEdit={() => handleEditBullet(bullet)}
                onDelete={() => handleDeleteBullet(bullet)}
              />
            ))}

            {items.length === 0 && (
              <div className="empty-state">
                <p>No bullets yet. Click "Add Bullet" to create one.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <BulletEditor
        entryId={entryId}
        bullet={editingBullet}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveBullet}
      />

      <ConfirmDialog
        isOpen={!!deletingBullet}
        onClose={() => setDeletingBullet(null)}
        onConfirm={confirmDelete}
        title="Delete Bullet"
        message="Are you sure you want to delete this bullet? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

export default BulletsList;
