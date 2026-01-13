import { useState, useEffect } from 'react';
import ResumeTitle from './ResumeTitle';
import SectionTitle from './SectionTitle';
import SectionEntry from './SectionEntry';
import './Resume.css';

interface BasicInfo {
  full_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  location: string | null;
  summary: string | null;
}

interface Bullet {
  id: number;
  content: string;
  display_order: number;
}

interface Entry {
  id: number;
  title: string;
  subtitle: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  display_order: number;
  bullets: Bullet[];
}

interface Section {
  id: number;
  title: string;
  section_type: string;
  display_order: number;
  is_visible: boolean;
  entries: Entry[];
}

interface ResumeData {
  basic_info: BasicInfo;
  sections: Section[];
}

interface APIResponse {
  success: boolean;
  data: ResumeData;
}

function Resume() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch('https://api.romeluis.com/api/resume');
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const result: APIResponse = await response.json();
        if (result.success) {
          setResumeData(result.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="resume-container">
        <div className="resume-content">
          <div className="resume-loading-skeleton">
            <div className="shimmer-load skeleton-title"></div>
            <div className="shimmer-load skeleton-contact"></div>

            <div className="skeleton-section">
              <div className="shimmer-load skeleton-section-title"></div>
              <div className="shimmer-load skeleton-line"></div>
              <div className="shimmer-load skeleton-line"></div>
              <div className="shimmer-load skeleton-line short"></div>
            </div>

            <div className="skeleton-section">
              <div className="shimmer-load skeleton-section-title"></div>
              <div className="shimmer-load skeleton-line"></div>
              <div className="shimmer-load skeleton-line"></div>
            </div>

            <div className="skeleton-section">
              <div className="shimmer-load skeleton-section-title"></div>
              <div className="shimmer-load skeleton-line"></div>
              <div className="shimmer-load skeleton-line"></div>
              <div className="shimmer-load skeleton-line short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-container">
        <div className="resume-error">Error: {error}</div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-container">
        <div className="resume-error">No resume data available</div>
      </div>
    );
  }

  return (
    <div className="resume-container">
      <div className="resume-content">
        <ResumeTitle basicInfo={resumeData.basic_info} />

        {resumeData.sections
          .sort((a, b) => a.display_order - b.display_order)
          .map((section) => (
            <div key={section.id} className="resume-section">
              <SectionTitle title={section.title} />
              {section.entries
                .sort((a, b) => a.display_order - b.display_order)
                .map((entry) => (
                  <SectionEntry key={entry.id} entry={entry} />
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Resume;
