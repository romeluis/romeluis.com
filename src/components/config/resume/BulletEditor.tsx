import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './BulletEditor.css';
import type { Bullet, BulletFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { useState, useEffect } from 'react';

interface BulletEditorProps {
  entryId: number;
  bullet: Bullet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulletFormData) => Promise<void>;
}

const bulletSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

function BulletEditor({ entryId, bullet, isOpen, onClose, onSave }: BulletEditorProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BulletFormData>({
    resolver: zodResolver(bulletSchema),
    defaultValues: {
      content: '',
    },
  });

  // Reset form when bullet changes or modal opens
  useEffect(() => {
    if (isOpen) {
      reset(
        bullet
          ? {
              content: bullet.content,
            }
          : {
              content: '',
            }
      );
    }
  }, [bullet, isOpen, reset]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: BulletFormData) => {
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
      title={bullet ? 'Edit Bullet' : 'Add Bullet'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="bullet-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            rows={4}
            placeholder="Describe an achievement, responsibility, or key point"
            {...register('content')}
          />
          {errors.content && <span className="field-error">{errors.content.message}</span>}
        </div>

        <div className="form-actions">
          <Button type="button" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : bullet ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default BulletEditor;
