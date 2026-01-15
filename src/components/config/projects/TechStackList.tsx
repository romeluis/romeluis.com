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
import ImageUpload from '../shared/ImageUpload';
import { dbClient } from '../utils/dbClient';

const TECH_COLORS = [
  { name: 'Green', value: '#91bf4b' },
  { name: 'Yellow', value: '#ffd05d' },
  { name: 'Orange', value: '#f26a2d' },
  { name: 'Pink', value: '#f96ba4' },
  { name: 'Blue', value: '#02a6ff' },
  { name: 'Black', value: '#120e14' },
  { name: 'Gray', value: '#afafaf' },
];

interface TechStackListProps {
  projectId: number;
  techStack: TechStackItem[];
  onRefresh: () => Promise<void>;
}

interface SortableChipProps {
  item: TechStackItem;
  onDelete: () => void;
  onUpdate: (color: string | null, imageUrl: string | null) => void;
}

function SortableChip({ item, onDelete, onUpdate }: SortableChipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleColorChange = async (newColor: string) => {
    const color = newColor === '' ? null : newColor;
    await onUpdate(color, item.image_url);
  };

  const handleImageUpload = async (newUrl: string) => {
    const url = newUrl.trim() === '' ? null : newUrl.trim();
    await onUpdate(item.color, url);
  };

  return (
    <div ref={setNodeRef} style={style} className="tech-chip">
      <div className="tech-chip-header">
        <span className="drag-handle" {...attributes} {...listeners}>
          ☰
        </span>
        <span className="tech-name">{item.name}</span>
        {item.color && (
          <div
            className="color-preview"
            style={{ backgroundColor: item.color }}
          />
        )}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-btn"
          aria-label="Edit tech stack item"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
        <button type="button" onClick={onDelete} className="delete-btn">
          ×
        </button>
      </div>
      {isExpanded && (
        <div className="tech-chip-details">
          <div className="tech-field">
            <label>Color:</label>
            <select
              value={item.color || ''}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-select"
            >
              <option value="">No color</option>
              {TECH_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>
          <div className="tech-field">
            <ImageUpload
              currentUrl={item.image_url || undefined}
              onUpload={handleImageUpload}
              label="Tech Icon"
            />
          </div>
        </div>
      )}
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

  const handleUpdate = async (itemId: number, color: string | null, imageUrl: string | null) => {
    try {
      await dbClient.updateTechStackItem(itemId, color, imageUrl);
      await onRefresh();
    } catch (error) {
      console.error('Failed to update tech stack item:', error);
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
                <SortableChip
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item)}
                  onUpdate={(color, imageUrl) => handleUpdate(item.id, color, imageUrl)}
                />
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
