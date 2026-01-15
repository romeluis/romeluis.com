import { useState, useEffect, useRef } from 'react';
import type { FilterState } from '../../structures/ProjectInformation';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

function FilterPanel({ filters, onChange, isOpen, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePinnedChange = (value: 'all' | 'pinned' | 'unpinned') => {
    setLocalFilters({ ...localFilters, isPinned: value });
  };

  const handleApply = () => {
    onChange(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const defaultFilters: FilterState = { isPinned: 'all' };
    setLocalFilters(defaultFilters);
    onChange(defaultFilters);
  };

  return (
    <div className="filter-panel" ref={panelRef} role="menu">
      <div className="filter-panel-section">
        <h3 className="filter-panel-heading">Pinned Status</h3>
        <div className="filter-panel-radio-group">
          <label className="filter-panel-radio">
            <input
              type="radio"
              name="pinned"
              value="all"
              checked={localFilters.isPinned === 'all'}
              onChange={() => handlePinnedChange('all')}
            />
            <span>All Projects</span>
          </label>
          <label className="filter-panel-radio">
            <input
              type="radio"
              name="pinned"
              value="pinned"
              checked={localFilters.isPinned === 'pinned'}
              onChange={() => handlePinnedChange('pinned')}
            />
            <span>Pinned Only</span>
          </label>
          <label className="filter-panel-radio">
            <input
              type="radio"
              name="pinned"
              value="unpinned"
              checked={localFilters.isPinned === 'unpinned'}
              onChange={() => handlePinnedChange('unpinned')}
            />
            <span>Unpinned Only</span>
          </label>
        </div>
      </div>

      <div className="filter-panel-actions">
        <button className="filter-panel-button filter-panel-button-secondary" onClick={handleClearAll}>
          Clear All
        </button>
        <button className="filter-panel-button filter-panel-button-primary" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
