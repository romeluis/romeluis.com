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
import './SectionsList.css';
import type { Section, SectionFormData } from '../utils/types';
import Button from '../shared/Button';
import SectionEditor from './SectionEditor';
import ConfirmDialog from '../shared/ConfirmDialog';
import EntriesList from './EntriesList';
import { dbClient } from '../utils/dbClient';

interface SectionsListProps {
  sections: Section[];
  onRefresh: () => Promise<void>;
}

interface SortableItemProps {
  section: Section;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  onRefresh: () => Promise<void>;
}

function SortableItem({ section, onEdit, onDelete, onToggleExpand, isExpanded, onRefresh }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="section-card">
      <div className="section-card-header">
        <div className="section-info">
          <span className="drag-handle" {...attributes} {...listeners}>
            ☰
          </span>
          <div>
            <h4>{section.title}</h4>
            <span className="section-meta">
              {section.is_visible ? '✓ Visible' : '✗ Hidden'} • {section.entries.length} entries
            </span>
          </div>
        </div>
        <div className="section-actions">
          <Button variant="secondary" onClick={onToggleExpand}>
            {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="section-expanded">
          <EntriesList sectionId={section.id} entries={section.entries} onRefresh={onRefresh} />
        </div>
      )}
    </div>
  );
}

function SectionsList({ sections, onRefresh }: SectionsListProps) {
  const [items, setItems] = useState(sections);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when sections prop changes
  useEffect(() => {
    setItems(sections);
  }, [sections]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Update display_order in database
      try {
        const reorderData = newItems.map((item, index) => ({
          id: item.id,
          display_order: index,
        }));
        await dbClient.reorderItems('sections', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder sections:', error);
        // Revert on error
        setItems(sections);
      }
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setIsEditorOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setIsEditorOpen(true);
  };

  const handleDeleteSection = (section: Section) => {
    setDeletingSection(section);
  };

  const confirmDelete = async () => {
    if (!deletingSection) return;

    try {
      await dbClient.deleteSection(deletingSection.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleSaveSection = async (data: SectionFormData) => {
    if (editingSection) {
      await dbClient.updateSection(editingSection.id, data);
    } else {
      await dbClient.createSection(data);
    }
    await onRefresh();
  };

  const toggleExpand = (sectionId: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className="sections-list">
      <div className="sections-header">
        <h3>Sections</h3>
        <Button variant="primary" onClick={handleAddSection}>
          Add Section
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="sections-container">
            {items.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                onEdit={() => handleEditSection(section)}
                onDelete={() => handleDeleteSection(section)}
                onToggleExpand={() => toggleExpand(section.id)}
                isExpanded={expandedSections.has(section.id)}
                onRefresh={onRefresh}
              />
            ))}

            {items.length === 0 && (
              <div className="empty-state">
                <p>No sections yet. Click "Add Section" to create one.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <SectionEditor
        section={editingSection}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveSection}
      />

      <ConfirmDialog
        isOpen={!!deletingSection}
        onClose={() => setDeletingSection(null)}
        onConfirm={confirmDelete}
        title="Delete Section"
        message={`Are you sure you want to delete "${deletingSection?.title}"? This will also delete all entries and bullets within it. This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

export default SectionsList;
