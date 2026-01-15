import { useState, useEffect } from 'react';
import './ComponentEditor.css';
import type { ProjectComponent, ComponentType, ComponentFormData } from '../utils/types';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import ImageUpload from '../shared/ImageUpload';

interface AvailableProject {
  id: number;
  name: string;
}

interface ComponentEditorProps {
  component: ProjectComponent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ComponentFormData) => Promise<void>;
  availableProjects?: AvailableProject[];
}

function ComponentEditor({ component, isOpen, onClose, onSave, availableProjects = [] }: ComponentEditorProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentType, setComponentType] = useState<ComponentType>('text');
  const [componentData, setComponentData] = useState<Record<string, any>>({});
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (component) {
        console.log('ComponentEditor - Loading component:', component);
        console.log('ComponentEditor - component_data:', component.component_data);
        setComponentType(component.component_type);
        // Parse component_data if it's a string, otherwise use as-is
        let parsedData = component.component_data;
        if (typeof parsedData === 'string') {
          try {
            parsedData = JSON.parse(parsedData);
          } catch (e) {
            console.error('Failed to parse component_data:', e);
            parsedData = {};
          }
        }
        // Deep clone to avoid reference issues
        const clonedData = JSON.parse(JSON.stringify(parsedData));
        console.log('ComponentEditor - Setting cloned data:', clonedData);
        setComponentData(clonedData);
      } else {
        console.log('ComponentEditor - Creating new component');
        setComponentType('text');
        setComponentData({});
      }
    } else {
      // Reset state when modal closes
      setComponentType('text');
      setComponentData({});
      setError(null);
    }
  }, [component, isOpen]);

  const handleClose = () => {
    setError(null);
    setComponentType('text');
    setComponentData({});
    onClose();
  };

  const updateData = (key: string, value: any) => {
    setComponentData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      await onSave({
        component_type: componentType,
        component_data: componentData,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (componentType) {
      case 'title':
        return (
          <>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={componentData.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subtitle">Subtitle</label>
              <input
                id="subtitle"
                type="text"
                value={componentData.subtitle || ''}
                onChange={(e) => updateData('subtitle', e.target.value)}
              />
            </div>
          </>
        );

      case 'about':
        return (
          <div className="form-group">
            <label htmlFor="text">About Text *</label>
            <textarea
              id="text"
              rows={6}
              value={componentData.text || ''}
              onChange={(e) => updateData('text', e.target.value)}
              required
            />
          </div>
        );

      case 'tech_stack':
        return (
          <div className="form-info">
            <p>This component displays the project's tech stack. No additional configuration needed.</p>
          </div>
        );

      case 'image_carousel':
        const carouselImages: Array<{ image_url: string; caption: string }> =
          Array.isArray(componentData.images) ? componentData.images : [];

        const handleAddImage = () => {
          updateData('images', [...carouselImages, { image_url: '', caption: '' }]);
        };

        const handleRemoveImage = (index: number) => {
          const updated = carouselImages.filter((_, i) => i !== index);
          updateData('images', updated);
        };

        const handleImageUpload = (index: number, url: string) => {
          const updated = [...carouselImages];
          updated[index] = { ...updated[index], image_url: url };
          updateData('images', updated);
        };

        const handleImageCaption = (index: number, caption: string) => {
          const updated = [...carouselImages];
          updated[index] = { ...updated[index], caption };
          updateData('images', updated);
        };

        return (
          <div className="form-group">
            <label>Carousel Images *</label>
            <div className="carousel-images-list">
              {carouselImages.map((img, index) => (
                <div key={index} className="carousel-image-item">
                  <div className="carousel-image-fields">
                    <ImageUpload
                      currentUrl={img.image_url || ''}
                      onUpload={(url) => handleImageUpload(index, url)}
                      label={`Image ${index + 1}`}
                    />
                    <div className="form-group carousel-caption-field">
                      <label htmlFor={`caption-${index}`}>Caption</label>
                      <input
                        id={`caption-${index}`}
                        type="text"
                        value={img.caption || ''}
                        onChange={(e) => handleImageCaption(index, e.target.value)}
                        placeholder="Optional caption"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddImage}
            >
              Add Image
            </Button>
            {carouselImages.length === 0 && (
              <span className="field-hint">Add at least one image to the carousel</span>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="form-group">
            <label htmlFor="text">Text *</label>
            <textarea
              id="text"
              rows={6}
              value={componentData.text || ''}
              onChange={(e) => updateData('text', e.target.value)}
              required
            />
          </div>
        );

      case 'text_with_title':
        return (
          <>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={componentData.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Text *</label>
              <textarea
                id="text"
                rows={6}
                value={componentData.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                required
              />
            </div>
          </>
        );

      case 'video':
        return (
          <>
            <div className="form-group">
              <label htmlFor="video_url">Video URL *</label>
              <input
                id="video_url"
                type="url"
                value={componentData.video_url || ''}
                onChange={(e) => updateData('video_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="caption">Caption</label>
              <input
                id="caption"
                type="text"
                value={componentData.caption || ''}
                onChange={(e) => updateData('caption', e.target.value)}
              />
            </div>
          </>
        );

      case 'text_with_image':
        return (
          <>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={componentData.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Text *</label>
              <textarea
                id="text"
                rows={4}
                value={componentData.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                required
              />
            </div>
            <ImageUpload
              currentUrl={componentData.image_url || ''}
              onUpload={(url) => updateData('image_url', url)}
              label="Image"
            />
            <div className="form-group">
              <label htmlFor="caption">Image Caption</label>
              <input
                id="caption"
                type="text"
                value={componentData.caption || ''}
                onChange={(e) => updateData('caption', e.target.value)}
                placeholder="Optional caption for the image"
              />
            </div>
            <div className="form-group">
              <label htmlFor="image_position">Image Position</label>
              <select
                id="image_position"
                value={componentData.image_position || 'right'}
                onChange={(e) => updateData('image_position', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      case 'text_image_title':
        return (
          <>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={componentData.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Text *</label>
              <textarea
                id="text"
                rows={4}
                value={componentData.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                required
              />
            </div>
            <ImageUpload
              currentUrl={componentData.image_url || ''}
              onUpload={(url) => updateData('image_url', url)}
              label="Image"
            />
            <div className="form-group">
              <label htmlFor="caption">Image Caption</label>
              <input
                id="caption"
                type="text"
                value={componentData.caption || ''}
                onChange={(e) => updateData('caption', e.target.value)}
                placeholder="Optional caption for the image"
              />
            </div>
          </>
        );

      case 'repository_links':
        return (
          <>
            <div className="form-group">
              <label htmlFor="github_url">GitHub URL</label>
              <input
                id="github_url"
                type="url"
                value={componentData.github_url || ''}
                onChange={(e) => updateData('github_url', e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="live_url">Live URL</label>
              <input
                id="live_url"
                type="url"
                value={componentData.live_url || ''}
                onChange={(e) => updateData('live_url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </>
        );

      case 'related_projects':
        const selectedIds: number[] = componentData.project_ids || [];

        const filteredProjects = availableProjects
          .filter(p => p.name.toLowerCase().includes(projectSearchTerm.toLowerCase()))
          .filter(p => !selectedIds.includes(p.id));

        const handleSelectProject = (projectId: number) => {
          updateData('project_ids', [...selectedIds, projectId]);
          setProjectSearchTerm('');
          setIsDropdownOpen(false);
        };

        const handleRemoveProject = (projectId: number) => {
          updateData('project_ids', selectedIds.filter(id => id !== projectId));
        };

        const selectedProjects = availableProjects.filter(p => selectedIds.includes(p.id));

        return (
          <div className="form-group">
            <label>Related Projects</label>

            {selectedProjects.length > 0 && (
              <div className="related-projects-selected">
                {selectedProjects.map(project => (
                  <div key={project.id} className="related-project-pill">
                    <span>{project.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(project.id)}
                      className="related-project-remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="related-projects-search">
              <input
                type="text"
                value={projectSearchTerm}
                onChange={(e) => {
                  setProjectSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search projects..."
              />

              {isDropdownOpen && filteredProjects.length > 0 && (
                <div className="related-projects-dropdown">
                  {filteredProjects.map(project => (
                    <button
                      key={project.id}
                      type="button"
                      className="related-project-option"
                      onClick={() => handleSelectProject(project.id)}
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="field-hint">Search and select related projects</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={component ? 'Edit Component' : 'Add Component'}
    >
      <form onSubmit={handleSubmit} className="component-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="component_type">Component Type *</label>
          <select
            id="component_type"
            value={componentType}
            onChange={(e) => {
              setComponentType(e.target.value as ComponentType);
              setComponentData({});
            }}
            disabled={!!component}
          >
            <option value="title">Title</option>
            <option value="about">About</option>
            <option value="tech_stack">Tech Stack</option>
            <option value="image_carousel">Image Carousel</option>
            <option value="text">Text</option>
            <option value="text_with_title">Text with Title</option>
            <option value="video">Video</option>
            <option value="text_with_image">Text with Image</option>
            <option value="text_image_title">Text, Image, and Title</option>
            <option value="repository_links">Repository Links</option>
            <option value="related_projects">Related Projects</option>
          </select>
          {component && (
            <span className="field-hint">Component type cannot be changed after creation</span>
          )}
        </div>

        {renderTypeSpecificFields()}

        <div className="form-actions">
          <Button type="button" onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : component ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ComponentEditor;
