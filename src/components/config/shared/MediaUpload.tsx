import { useState, useRef, useEffect } from 'react';
import './MediaUpload.css';
import Button from './Button';
import Spinner from './Spinner';
import { dbClient } from '../utils/dbClient';

interface MediaUploadProps {
  currentUrl?: string;
  currentMediaType?: 'image' | 'video';
  onUpload: (url: string, mediaType: 'image' | 'video') => void;
  label?: string;
}

function MediaUpload({
  currentUrl,
  currentMediaType,
  onUpload,
  label = 'Media',
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(currentMediaType || 'image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentUrl changes
  useEffect(() => {
    setPreview(currentUrl || null);
    if (currentMediaType) {
      setMediaType(currentMediaType);
    }
  }, [currentUrl, currentMediaType]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File must be smaller than ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          setPreview(base64);
          setMediaType(isVideo ? 'video' : 'image');

          // Upload to R2
          const result = await dbClient.uploadMedia(base64, file.name);
          onUpload(result.url, result.mediaType);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to upload');
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
      setError(err instanceof Error ? err.message : 'Failed to upload');
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setMediaType('image');
    onUpload('', 'image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="media-upload">
      <label className="media-upload-label">{label}</label>
      <div className="media-upload-content">
        {preview && (
          <div className="media-preview">
            {mediaType === 'video' ? (
              <video src={preview} muted loop playsInline />
            ) : (
              <img src={preview} alt="Preview" />
            )}
          </div>
        )}

        <div className="media-upload-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={handleClick}
            disabled={uploading}
          >
            {uploading ? <Spinner /> : preview ? 'Change' : 'Upload'}
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

        {error && <span className="media-upload-error">{error}</span>}
      </div>
    </div>
  );
}

export default MediaUpload;
