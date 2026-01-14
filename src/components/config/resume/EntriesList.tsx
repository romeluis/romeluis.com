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
import './EntriesList.css';
import type { Entry, EntryFormData } from '../utils/types';
import Button from '../shared/Button';
import EntryEditor from './EntryEditor';
import ConfirmDialog from '../shared/ConfirmDialog';
import BulletsList from './BulletsList';
import { dbClient } from '../utils/dbClient';

interface EntriesListProps {
  sectionId: number;
  entries: Entry[];
  onRefresh: () => Promise<void>;
}

interface SortableItemProps {
  entry: Entry;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  onRefresh: () => Promise<void>;
}

function SortableItem({ entry, onEdit, onDelete, onToggleExpand, isExpanded, onRefresh }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const dateRange = entry.is_current
    ? `${formatDate(entry.start_date)} - Present`
    : `${formatDate(entry.start_date)} - ${formatDate(entry.end_date)}`;

  return (
    <div ref={setNodeRef} style={style} className="entry-card">
      <div className="entry-card-header">
        <div className="entry-info">
          <span className="drag-handle" {...attributes} {...listeners}>
            ☰
          </span>
          <div>
            <h5>{entry.title}</h5>
            <span className="entry-meta">
              {entry.subtitle && `${entry.subtitle} • `}
              {dateRange} • {entry.bullets.length} bullets
            </span>
          </div>
        </div>
        <div className="entry-actions">
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
        <div className="entry-expanded">
          {entry.description && <p className="entry-description">{entry.description}</p>}
          <BulletsList entryId={entry.id} bullets={entry.bullets} onRefresh={onRefresh} />
        </div>
      )}
    </div>
  );
}

function EntriesList({ sectionId, entries, onRefresh }: EntriesListProps) {
  const [items, setItems] = useState(entries);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(entries);
  }, [entries]);

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
        await dbClient.reorderItems('entries', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder entries:', error);
        setItems(entries);
      }
    }
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleDeleteEntry = (entry: Entry) => {
    setDeletingEntry(entry);
  };

  const confirmDelete = async () => {
    if (!deletingEntry) return;

    try {
      await dbClient.deleteEntry(deletingEntry.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const handleSaveEntry = async (data: EntryFormData) => {
    if (editingEntry) {
      await dbClient.updateEntry(editingEntry.id, data);
    } else {
      await dbClient.createEntry(sectionId, data);
    }
    await onRefresh();
  };

  const toggleExpand = (entryId: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  return (
    <div className="entries-list">
      <div className="entries-header">
        <h4>Entries</h4>
        <Button variant="primary" onClick={handleAddEntry}>
          Add Entry
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="entries-container">
            {items.map((entry) => (
              <SortableItem
                key={entry.id}
                entry={entry}
                onEdit={() => handleEditEntry(entry)}
                onDelete={() => handleDeleteEntry(entry)}
                onToggleExpand={() => toggleExpand(entry.id)}
                isExpanded={expandedEntries.has(entry.id)}
                onRefresh={onRefresh}
              />
            ))}

            {items.length === 0 && (
              <div className="empty-state">
                <p>No entries yet. Click "Add Entry" to create one.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <EntryEditor
        sectionId={sectionId}
        entry={editingEntry}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEntry}
      />

      <ConfirmDialog
        isOpen={!!deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onConfirm={confirmDelete}
        title="Delete Entry"
        message={`Are you sure you want to delete "${deletingEntry?.title}"? This will also delete all bullets within it. This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

export default EntriesList;
