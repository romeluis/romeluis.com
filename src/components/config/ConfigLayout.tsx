import { useState } from 'react';
import './ConfigLayout.css';
import ConfigNavigation from './ConfigNavigation';
import ResumeConfigPanel from './resume/ResumeConfigPanel';

type ConfigSection = 'resume' | 'projects';

function ConfigLayout() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('resume');

  return (
    <div className="config-layout">
      <ConfigNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="config-content">
        {activeSection === 'resume' && <ResumeConfigPanel />}
        {activeSection === 'projects' && (
          <div className="config-placeholder">
            <h2>Projects Configuration</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigLayout;
