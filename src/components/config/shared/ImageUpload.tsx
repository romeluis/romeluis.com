import { useState, useRef } from 'react';
import './ImageUpload.css';
import Button from './Button';
import Spinner from './Spinner';
import { dbClient } from '../utils/dbClient';

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

function ImageUpload({ currentUrl, onUpload, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          setPreview(base64);

          // Upload to R2
          const url = await dbClient.uploadImage(base64, file.name);
          onUpload(url);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to upload image');
          setPreview(currentUrl || null);
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <label className="image-upload-label">{label}</label>
      <div className="image-upload-content">
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className="image-upload-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={handleClick}
            disabled={uploading}
          >
            {uploading ? <Spinner /> : preview ? 'Change Image' : 'Upload Image'}
          </Button>

          {preview && (
            <Button
              type="button"
              variant="danger"
              onClick={handleRemove}
              disabled={uploading}
            >
              Remove
            </Button>
          )}
        </div>

        {error && <span className="image-upload-error">{error}</span>}
      </div>
    </div>
  );
}

export default ImageUpload;
