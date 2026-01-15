import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './EntryEditor.css';
import type { Entry, EntryFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { useState, useEffect } from 'react';

interface EntryEditorProps {
  sectionId: number;
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntryFormData) => Promise<void>;
}

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string(),
  location: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  is_current: z.boolean(),
  description: z.string(),
});

function EntryEditor({ entry, isOpen, onClose, onSave }: EntryEditorProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: '',
      subtitle: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    },
  });

  const isCurrent = watch('is_current');

  // Reset form when entry changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset(
        entry
          ? {
              title: entry.title,
              subtitle: entry.subtitle || '',
              location: entry.location || '',
              start_date: entry.start_date || '',
              end_date: entry.end_date || '',
              is_current: entry.is_current,
              description: entry.description || '',
            }
          : {
              title: '',
              subtitle: '',
              location: '',
              start_date: '',
              end_date: '',
              is_current: false,
              description: '',
            }
      );
    }
  }, [entry, isOpen, reset]);

  // Clear end_date when is_current is checked
  useEffect(() => {
    if (isCurrent) {
      setValue('end_date', '');
    }
  }, [isCurrent, setValue]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: EntryFormData) => {
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
      title={entry ? 'Edit Entry' : 'Add Entry'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input id="title" type="text" {...register('title')} />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            id="subtitle"
            type="text"
            placeholder="e.g., Company name, school name"
            {...register('subtitle')}
          />
          {errors.subtitle && <span className="field-error">{errors.subtitle.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            {...register('location')}
          />
          {errors.location && <span className="field-error">{errors.location.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">Start Date</label>
            <input id="start_date" type="date" {...register('start_date')} />
            {errors.start_date && <span className="field-error">{errors.start_date.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date</label>
            <input id="end_date" type="date" {...register('end_date')} disabled={isCurrent} />
            {errors.end_date && <span className="field-error">{errors.end_date.message}</span>}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" {...register('is_current')} />
            <span>Currently working here</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            placeholder="Brief description of role or achievements"
            {...register('description')}
          />
          {errors.description && <span className="field-error">{errors.description.message}</span>}
        </div>

        <div className="form-actions">
          <Button type="button" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : entry ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EntryEditor;
