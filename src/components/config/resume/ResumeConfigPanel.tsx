import { useState, useEffect } from 'react';
import './ResumeConfigPanel.css';
import { dbClient } from '../utils/dbClient';
import type { ResumeData } from '../utils/types';
import Spinner from '../shared/Spinner';
import ErrorMessage from '../shared/ErrorMessage';
import BasicInfoEditor from './BasicInfoEditor';
import SectionsList from './SectionsList';

function ResumeConfigPanel() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load resume data
  const loadResumeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dbClient.getResumeData();
      setResumeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  if (loading) {
    return (
      <div className="resume-config-panel">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-config-panel">
        <ErrorMessage message={error} onRetry={loadResumeData} />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-config-panel">
        <ErrorMessage message="No resume data found" onRetry={loadResumeData} />
      </div>
    );
  }

  return (
    <div className="resume-config-panel">
      <h2>Resume Configuration</h2>

      <BasicInfoEditor
        basicInfo={resumeData.basicInfo}
        onSave={async (data) => {
          await dbClient.updateBasicInfo(data);
          await loadResumeData();
        }}
      />

      <SectionsList
        sections={resumeData.sections}
        onRefresh={loadResumeData}
      />
    </div>
  );
}

export default ResumeConfigPanel;
