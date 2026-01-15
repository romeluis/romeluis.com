import { useEffect, useRef } from 'react';
import type { SortOption } from '../../structures/ProjectInformation';
import './SortDropdown.css';

interface SortDropdownProps {
  currentSort: SortOption;
  onChange: (option: SortOption) => void;
  isOpen: boolean;
  onClose: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-newest', label: 'Date (Newest First)' },
  { value: 'date-oldest', label: 'Date (Oldest First)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

function SortDropdown({ currentSort, onChange, isOpen, onClose }: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleSelect = (option: SortOption) => {
    onChange(option);
    onClose();
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef} role="menu">
      <div className="sort-dropdown-options">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`sort-dropdown-option ${currentSort === option.value ? 'sort-dropdown-option-active' : ''}`}
            onClick={() => handleSelect(option.value)}
            role="menuitem"
            aria-selected={currentSort === option.value}
          >
            <span className="sort-dropdown-option-radio">
              {currentSort === option.value && '●'}
            </span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SortDropdown;
