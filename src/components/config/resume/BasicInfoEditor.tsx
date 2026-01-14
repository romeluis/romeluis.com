import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './BasicInfoEditor.css';
import type { BasicInfo, BasicInfoFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

interface BasicInfoEditorProps {
  basicInfo: BasicInfo;
  onSave: (data: BasicInfoFormData) => Promise<void>;
}

// Validation schema
const basicInfoSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string(),
  linkedin_url: z.string().url('Invalid URL').or(z.literal('')),
  github_url: z.string().url('Invalid URL').or(z.literal('')),
  website_url: z.string().url('Invalid URL').or(z.literal('')),
  location: z.string(),
  summary: z.string(),
});

function BasicInfoEditor({ basicInfo, onSave }: BasicInfoEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      full_name: basicInfo.full_name,
      email: basicInfo.email || '',
      phone: basicInfo.phone || '',
      linkedin_url: basicInfo.linkedin_url || '',
      github_url: basicInfo.github_url || '',
      website_url: basicInfo.website_url || '',
      location: basicInfo.location || '',
      summary: basicInfo.summary || '',
    },
  });

  const handleEdit = () => {
    reset({
      full_name: basicInfo.full_name,
      email: basicInfo.email || '',
      phone: basicInfo.phone || '',
      linkedin_url: basicInfo.linkedin_url || '',
      github_url: basicInfo.github_url || '',
      website_url: basicInfo.website_url || '',
      location: basicInfo.location || '',
      summary: basicInfo.summary || '',
    });
    setError(null);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setError(null);
  };

  const onSubmit = async (data: BasicInfoFormData) => {
    try {
      setSaving(true);
      setError(null);
      await onSave(data);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="basic-info-editor">
      <div className="basic-info-header">
        <h3>Basic Information</h3>
        <Button onClick={handleEdit} variant="secondary">
          Edit
        </Button>
      </div>

      <div className="basic-info-display">
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span>{basicInfo.full_name}</span>
        </div>
        {basicInfo.email && (
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span>{basicInfo.email}</span>
          </div>
        )}
        {basicInfo.phone && (
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span>{basicInfo.phone}</span>
          </div>
        )}
        {basicInfo.location && (
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span>{basicInfo.location}</span>
          </div>
        )}
      </div>

      <Modal isOpen={isEditing} onClose={handleClose} title="Edit Basic Information">
        <form onSubmit={handleSubmit(onSubmit)} className="basic-info-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input id="full_name" type="text" {...register('full_name')} />
            {errors.full_name && (
              <span className="field-error">{errors.full_name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="tel" {...register('phone')} />
            {errors.phone && <span className="field-error">{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn URL</label>
            <input id="linkedin_url" type="url" {...register('linkedin_url')} />
            {errors.linkedin_url && (
              <span className="field-error">{errors.linkedin_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="github_url">GitHub URL</label>
            <input id="github_url" type="url" {...register('github_url')} />
            {errors.github_url && (
              <span className="field-error">{errors.github_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="website_url">Website URL</label>
            <input id="website_url" type="url" {...register('website_url')} />
            {errors.website_url && (
              <span className="field-error">{errors.website_url.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" type="text" {...register('location')} />
            {errors.location && (
              <span className="field-error">{errors.location.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" rows={4} {...register('summary')} />
            {errors.summary && (
              <span className="field-error">{errors.summary.message}</span>
            )}
          </div>

          <div className="form-actions">
            <Button type="button" onClick={handleClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BasicInfoEditor;
