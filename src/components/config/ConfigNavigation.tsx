import './ConfigNavigation.css';

interface ConfigNavigationProps {
  activeSection: 'resume' | 'projects';
  onSectionChange: (section: 'resume' | 'projects') => void;
}

function ConfigNavigation({ activeSection, onSectionChange }: ConfigNavigationProps) {
  return (
    <nav className="config-navigation">
      <h3>Configuration</h3>
      <ul>
        <li>
          <button
            className={activeSection === 'resume' ? 'active' : ''}
            onClick={() => onSectionChange('resume')}
          >
            Resume
          </button>
        </li>
        <li>
          <button
            className={activeSection === 'projects' ? 'active' : ''}
            onClick={() => onSectionChange('projects')}
          >
            Projects
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default ConfigNavigation;
