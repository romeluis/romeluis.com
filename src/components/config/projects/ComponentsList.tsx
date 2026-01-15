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
import './ComponentsList.css';
import type { ProjectComponent, ComponentFormData } from '../utils/types';
import Button from '../shared/Button';
import ComponentEditor from './ComponentEditor';
import ConfirmDialog from '../shared/ConfirmDialog';
import { dbClient } from '../utils/dbClient';

interface AvailableProject {
  id: number;
  name: string;
}

interface ComponentsListProps {
  projectId: number;
  components: ProjectComponent[];
  onRefresh: () => Promise<void>;
  availableProjects?: AvailableProject[];
}

interface SortableItemProps {
  component: ProjectComponent;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableItem({ component, onEdit, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getComponentPreview = () => {
    switch (component.component_type) {
      case 'title':
        return component.component_data.title || 'Title';
      case 'about':
        return 'About section';
      case 'tech_stack':
        return 'Tech stack display';
      case 'image_carousel':
        return `Image carousel (${component.component_data.images?.length || 0} images)`;
      case 'text':
        return component.component_data.text?.substring(0, 50) || 'Text';
      case 'text_with_title':
        return component.component_data.title || 'Text with title';
      case 'video':
        return 'Video';
      case 'text_with_image':
        return component.component_data.title || 'Text with image';
      case 'text_image_title':
        return component.component_data.title || 'Text, image, and title';
      case 'repository_links':
        return 'Repository links';
      case 'related_projects':
        return 'Related projects';
      default:
        return component.component_type;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="component-item">
      <div className="component-info">
        <span className="drag-handle" {...attributes} {...listeners}>
          ☰
        </span>
        <div>
          <span className="component-type">{component.component_type}</span>
          <span className="component-preview">{getComponentPreview()}</span>
        </div>
      </div>
      <div className="component-actions">
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

function ComponentsList({ projectId, components, onRefresh, availableProjects = [] }: ComponentsListProps) {
  const [items, setItems] = useState(components);
  const [editingComponent, setEditingComponent] = useState<ProjectComponent | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingComponent, setDeletingComponent] = useState<ProjectComponent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(components);
  }, [components]);

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
        await dbClient.reorderItems('components', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder components:', error);
        setItems(components);
      }
    }
  };

  const handleAddComponent = () => {
    setEditingComponent(null);
    setIsEditorOpen(true);
  };

  const handleEditComponent = (component: ProjectComponent) => {
    setEditingComponent(component);
    setIsEditorOpen(true);
  };

  const handleDeleteComponent = (component: ProjectComponent) => {
    setDeletingComponent(component);
  };

  const confirmDelete = async () => {
    if (!deletingComponent) return;

    try {
      await dbClient.deleteComponent(deletingComponent.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete component:', error);
    } finally {
      setDeletingComponent(null);
    }
  };

  const handleSaveComponent = async (data: ComponentFormData) => {
    if (editingComponent) {
      await dbClient.updateComponent(editingComponent.id, data);
    } else {
      await dbClient.createComponent(projectId, data);
    }
    await onRefresh();
  };

  return (
    <div className="components-list">
      <div className="components-header">
        <Button variant="primary" onClick={handleAddComponent}>
          Add Component
        </Button>
      </div>

      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="components-container">
              {items.map((component) => (
                <SortableItem
                  key={component.id}
                  component={component}
                  onEdit={() => handleEditComponent(component)}
                  onDelete={() => handleDeleteComponent(component)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="empty-state">
          <p>No components yet. Click "Add Component" to create one.</p>
        </div>
      )}

      <ComponentEditor
        key={editingComponent?.id || 'new'}
        component={editingComponent}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveComponent}
        availableProjects={availableProjects}
      />

      <ConfirmDialog
        isOpen={!!deletingComponent}
        onClose={() => setDeletingComponent(null)}
        onConfirm={confirmDelete}
        title="Delete Component"
        message="Are you sure you want to delete this component? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

export default ComponentsList;
