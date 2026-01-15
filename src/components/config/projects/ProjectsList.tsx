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
import './ProjectsList.css';
import type { Project, ProjectFormData } from '../utils/types';
import Button from '../shared/Button';
import ProjectEditor from './ProjectEditor';
import ConfirmDialog from '../shared/ConfirmDialog';
import TechStackList from './TechStackList';
import TagsList from './TagsList';
import ComponentsList from './ComponentsList';
import { dbClient } from '../utils/dbClient';

interface ProjectsListProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
}

interface SortableItemProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
  onRefresh: () => Promise<void>;
}

function SortableItem({ project, onEdit, onDelete, onToggleExpand, isExpanded, onRefresh }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const dateRange = project.date_ended
    ? `${formatDate(project.date_started)} - ${formatDate(project.date_ended)}`
    : `${formatDate(project.date_started)} - Present`;

  return (
    <div ref={setNodeRef} style={style} className="project-card">
      <div className="project-card-header">
        <div className="project-info">
          <span className="drag-handle" {...attributes} {...listeners}>
            ☰
          </span>
          <div>
            <h4>{project.name}</h4>
            <span className="project-meta">
              {project.is_pinned ? '📌 Pinned' : ''} {project.is_pinned && ' • '}
              {dateRange} • {project.components?.length || 0} components
            </span>
          </div>
        </div>
        <div className="project-actions">
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
        <div className="project-expanded">
          <div className="project-details-grid">
            <div className="project-detail-section">
              <h5>Tech Stack</h5>
              <TechStackList projectId={project.id} techStack={project.tech_stack} onRefresh={onRefresh} />
            </div>
            <div className="project-detail-section">
              <h5>Tags</h5>
              <TagsList projectId={project.id} tags={project.tags} onRefresh={onRefresh} />
            </div>
          </div>
          <div className="project-detail-section">
            <h5>Components</h5>
            <ComponentsList projectId={project.id} components={project.components || []} onRefresh={onRefresh} />
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsList({ projects, onRefresh }: ProjectsListProps) {
  const [items, setItems] = useState(projects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when projects prop changes
  useEffect(() => {
    setItems(projects);
  }, [projects]);

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
        await dbClient.reorderItems('projects', reorderData);
        await onRefresh();
      } catch (error) {
        console.error('Failed to reorder projects:', error);
        // Revert on error
        setItems(projects);
      }
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsEditorOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;

    try {
      await dbClient.deleteProject(deletingProject.id);
      await onRefresh();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setDeletingProject(null);
    }
  };

  const handleSaveProject = async (data: ProjectFormData) => {
    if (editingProject) {
      await dbClient.updateProject(editingProject.id, data);
    } else {
      await dbClient.createProject(data);
    }
    await onRefresh();
  };

  const toggleExpand = (projectId: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <div className="projects-list">
      <div className="projects-header">
        <h3>Projects</h3>
        <Button variant="primary" onClick={handleAddProject}>
          Add Project
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="projects-container">
            {items.map((project) => (
              <SortableItem
                key={project.id}
                project={project}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project)}
                onToggleExpand={() => toggleExpand(project.id)}
                isExpanded={expandedProjects.has(project.id)}
                onRefresh={onRefresh}
              />
            ))}

            {items.length === 0 && (
              <div className="empty-state">
                <p>No projects yet. Click "Add Project" to create one.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <ProjectEditor
        project={editingProject}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProject}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This will also delete all tech stack items, tags, and components within it. This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

export default ProjectsList;
