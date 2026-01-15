import { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder = 'Search projects...' }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
    if (value) {
      setIsExpanded(true);
    }
  }, [value]);

  const handleToggle = () => {
    if (isExpanded && !localValue) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`search-bar ${isExpanded ? 'search-bar-expanded' : ''}`}>
      {!isExpanded ? (
        <button
          className="search-bar-button"
          onClick={handleToggle}
          aria-label="Open search"
        >
          <img src="/Search Symbol.svg" alt="" className="search-bar-icon" aria-hidden="true" />
        </button>
      ) : (
        <div className="search-bar-input-container">
          <img src="/Search Symbol.svg" alt="" className="search-bar-icon" aria-hidden="true" />
          <input
            type="text"
            className="search-bar-input"
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label="Search projects"
            autoFocus
          />
          {localValue && (
            <button
              className="search-bar-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
