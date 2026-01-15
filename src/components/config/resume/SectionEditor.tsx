import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './SectionEditor.css';
import type { Section, SectionFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { useState, useEffect } from 'react';

interface SectionEditorProps {
  section: Section | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SectionFormData) => Promise<void>;
}

const sectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  section_type: z.string().min(1, 'Section type is required'),
  is_visible: z.boolean(),
});

function SectionEditor({ section, isOpen, onClose, onSave }: SectionEditorProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: '',
      section_type: '',
      is_visible: true,
    },
  });

  // Reset form when section changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset(
        section
          ? {
              title: section.title,
              section_type: section.section_type,
              is_visible: section.is_visible,
            }
          : {
              title: '',
              section_type: '',
              is_visible: true,
            }
      );
    }
  }, [section, isOpen, reset]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: SectionFormData) => {
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
      title={section ? 'Edit Section' : 'Add Section'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="section-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Section Title *</label>
          <input id="title" type="text" {...register('title')} />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="section_type">Section Type *</label>
          <input
            id="section_type"
            type="text"
            placeholder="e.g., experience, education, skills"
            {...register('section_type')}
          />
          {errors.section_type && (
            <span className="field-error">{errors.section_type.message}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" {...register('is_visible')} />
            <span>Visible on resume</span>
          </label>
        </div>

        <div className="form-actions">
          <Button type="button" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : section ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default SectionEditor;
