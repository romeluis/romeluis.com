import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './ProjectEditor.css';
import type { Project, ProjectFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import ImageUpload from '../shared/ImageUpload';
import { useState, useEffect } from 'react';

interface ProjectEditorProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => Promise<void>;
}

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  subheading: z.string(),
  color: z.string(),
  date_started: z.string().min(1, 'Start date is required'),
  date_ended: z.string(),
  is_pinned: z.boolean(),
  poster_image_url: z.string(),
});

function ProjectEditor({ project, isOpen, onClose, onSave }: ProjectEditorProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterImageUrl, setPosterImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      subheading: '',
      color: '',
      date_started: '',
      date_ended: '',
      is_pinned: false,
      poster_image_url: '',
    },
  });

  // Reset form when project changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      reset(
        project
          ? {
              name: project.name,
              subheading: project.subheading || '',
              color: project.color || '',
              date_started: formatDateForInput(project.date_started),
              date_ended: formatDateForInput(project.date_ended),
              is_pinned: project.is_pinned,
              poster_image_url: project.poster_image_url || '',
            }
          : {
              name: '',
              subheading: '',
              color: '',
              date_started: '',
              date_ended: '',
              is_pinned: false,
              poster_image_url: '',
            }
      );
      setPosterImageUrl(project?.poster_image_url || '');
    }
  }, [project, isOpen, reset]);

  const handleClose = () => {
    reset();
    setError(null);
    setPosterImageUrl('');
    onClose();
  };

  const handleImageUpload = (url: string) => {
    setPosterImageUrl(url);
    setValue('poster_image_url', url);
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setSaving(true);
      setError(null);
      await onSave(data);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={project ? 'Edit Project' : 'Add Project'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="project-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Project Name *</label>
          <input id="name" type="text" {...register('name')} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subheading">Subheading</label>
          <input
            id="subheading"
            type="text"
            placeholder="Optional subtitle or tagline"
            {...register('subheading')}
          />
          {errors.subheading && (
            <span className="field-error">{errors.subheading.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="color">Project Color</label>
          <select id="color" {...register('color')}>
            <option value="">None</option>
            <option value="#91bf4b">Green</option>
            <option value="#ffd05d">Yellow</option>
            <option value="#f26a2d">Orange</option>
            <option value="#f96ba4">Pink</option>
            <option value="#02a6ff">Blue</option>
          </select>
          {errors.color && (
            <span className="field-error">{errors.color.message}</span>
          )}
        </div>

        <ImageUpload
          currentUrl={posterImageUrl}
          onUpload={handleImageUpload}
          label="Poster Image"
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_started">Start Date *</label>
            <input id="date_started" type="date" {...register('date_started')} />
            {errors.date_started && (
              <span className="field-error">{errors.date_started.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date_ended">End Date</label>
            <input
              id="date_ended"
              type="date"
              placeholder="Leave empty for ongoing projects"
              {...register('date_ended')}
            />
            {errors.date_ended && (
              <span className="field-error">{errors.date_ended.message}</span>
            )}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" {...register('is_pinned')} />
            <span>Pin to top of projects list</span>
          </label>
        </div>

        <div className="form-actions">
          <Button type="button" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : project ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProjectEditor;
