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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TechStackList.css';
import type { TechStackItem } from '../utils/types';
import Button from '../shared/Button';
import ConfirmDialog from '../shared/ConfirmDialog';
import { dbClient } from '../utils/dbClient';

interface TechStackListProps {
  projectId: number;
  techStack: TechStackItem[];
  onRefresh: () => Promise<void>;
}

interface SortableChipProps {
  item: TechStackItem;
  onDelete: () => void;
}

function SortableChip({ item, onDelete }: SortableChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="tech-chip">
      <span className="drag-handle" {...attributes} {...listeners}>
        ☰
      </span>
      <span className="tech-name">{item.name}</span>
      <button type="button" onClick={onDelete} className="delete-btn">
        ×
      </button>
    </div>
  );
}

function TechStackList({ projectId, techStack, onRefresh }: TechStackListProps) {
  const [items, setItems] = useState(techStack);
  const [newTechName, setNewTechName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TechStackItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(techStack);
  }, [techStack]);

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
        await dbClient.reorderItems('tech_stack', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder tech stack:', error);
        setItems(techStack);
      }
    }
  };

  const handleAdd = async () => {
    if (!newTechName.trim()) return;

    try {
      setAdding(true);
      await dbClient.createTechStackItem(projectId, { name: newTechName.trim() });
      setNewTechName('');
      await onRefresh();
    } catch (error) {
      console.error('Failed to add tech stack item:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (item: TechStackItem) => {
    setDeletingItem(item);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await dbClient.deleteTechStackItem(deletingItem.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete tech stack item:', error);
    } finally {
      setDeletingItem(null);
    }
  };

  return (
    <div className="tech-stack-list">
      <div className="add-tech-form">
        <input
          type="text"
          value={newTechName}
          onChange={(e) => setNewTechName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add technology..."
          disabled={adding}
        />
        <Button variant="primary" onClick={handleAdd} disabled={adding || !newTechName.trim()}>
          Add
        </Button>
      </div>

      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
            <div className="tech-chips">
              {items.map((item) => (
                <SortableChip key={item.id} item={item} onDelete={() => handleDelete(item)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="empty-message">No tech stack items yet.</p>
      )}

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Tech Stack Item"
        message={`Are you sure you want to delete "${deletingItem?.name}"?`}
        confirmText="Delete"
      />
    </div>
  );
}

export default TechStackList;
