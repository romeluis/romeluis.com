import { useState, useEffect } from 'react';
import './TechStackManager.css';
import { dbClient } from './utils/dbClient';
import Button from './shared/Button';
import ConfirmDialog from './shared/ConfirmDialog';

interface MasterTechItem {
  id: number;
  name: string;
  color: string | null;
  image_url: string | null;
}

interface TechUsageInfo {
  techId: number;
  count: number;
  projects: Array<{id: number; name: string}>;
}

function TechStackManager() {
  const [techItems, setTechItems] = useState<MasterTechItem[]>([]);
  const [usageInfo, setUsageInfo] = useState<Map<number, TechUsageInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [editingTech, setEditingTech] = useState<MasterTechItem | null>(null);
  const [deletingTech, setDeletingTech] = useState<MasterTechItem | null>(null);
  const [expandedTechId, setExpandedTechId] = useState<number | null>(null);

  useEffect(() => {
    loadTechStack();
  }, []);

  const loadTechStack = async () => {
    try {
      setLoading(true);
      const techs = await dbClient.getAllTechStack();
      setTechItems(techs);

      // Load usage info for each tech
      const usageMap = new Map<number, TechUsageInfo>();
      for (const tech of techs) {
        const count = await dbClient.getTechUsageCount(tech.id);
        const projects = count > 0 ? await dbClient.getTechProjects(tech.id) : [];
        usageMap.set(tech.id, { techId: tech.id, count, projects });
      }
      setUsageInfo(usageMap);
    } catch (error) {
      console.error('Failed to load tech stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTech) return;

    try {
      await dbClient.deleteMasterTech(deletingTech.id);
      await loadTechStack();
    } catch (error) {
      console.error('Failed to delete tech:', error);
      alert('Failed to delete tech: ' + (error as Error).message);
    } finally {
      setDeletingTech(null);
    }
  };

  const toggleExpand = (techId: number) => {
    setExpandedTechId(expandedTechId === techId ? null : techId);
  };

  if (loading) {
    return <div className="tech-stack-manager">Loading...</div>;
  }

  return (
    <div className="tech-stack-manager">
      <div className="manager-header">
        <h2>Tech Stack Library</h2>
        <p className="manager-description">
          Manage all technologies used across your projects. Editing a tech item will affect all projects that use it.
        </p>
      </div>

      <div className="tech-list">
        {techItems.map(tech => {
          const usage = usageInfo.get(tech.id);
          const isExpanded = expandedTechId === tech.id;

          return (
            <div key={tech.id} className="tech-item">
              <div className="tech-item-header">
                <div className="tech-info">
                  <span className="tech-item-name">{tech.name}</span>
                  {tech.color && (
                    <div
                      className="tech-color-dot"
                      style={{ backgroundColor: tech.color }}
                    />
                  )}
                </div>

                <div className="tech-actions">
                  <span className="usage-badge">
                    Used in {usage?.count || 0} project(s)
                  </span>

                  {usage && usage.count > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(tech.id)}
                      className="view-projects-btn"
                    >
                      {isExpanded ? 'Hide Projects' : 'View Projects'}
                    </button>
                  )}

                  {usage && usage.count === 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setDeletingTech(tech)}
                      size="sm"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              {tech.image_url && (
                <div className="tech-icon-preview">
                  <img src={tech.image_url} alt={tech.name} />
                </div>
              )}

              {isExpanded && usage && usage.projects.length > 0 && (
                <div className="projects-list">
                  <h4>Projects using {tech.name}:</h4>
                  <ul>
                    {usage.projects.map(project => (
                      <li key={project.id}>{project.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {techItems.length === 0 && (
        <p className="empty-message">No technologies in the library yet.</p>
      )}

      <ConfirmDialog
        isOpen={!!deletingTech}
        onClose={() => setDeletingTech(null)}
        onConfirm={handleDelete}
        title="Delete Technology"
        message={`Are you sure you want to delete "${deletingTech?.name}" from the tech stack library? This cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

export default TechStackManager;
