import BulletPoint from './BulletPoint';
import './SectionEntry.css';

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

interface SectionEntryProps {
  entry: Entry;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function SectionEntry({ entry }: SectionEntryProps) {
  const dateRange = (() => {
    if (!entry.start_date) return '';
    const startDate = formatDate(entry.start_date);
    const endDate = entry.is_current ? 'Present' : formatDate(entry.end_date);

    if (!endDate) {
      return startDate;
    }
    return `${startDate} – ${endDate}`;
  })();

  return (
    <div className="section-entry">
      <div className="entry-header">
        <div className="entry-left">
          <div className="entry-title">{entry.title}</div>
          {entry.subtitle && (
            <div className="entry-subtitle">{entry.subtitle}</div>
          )}
        </div>
        <div className="entry-right">
          {dateRange && <div className="entry-date">{dateRange}</div>}
          {entry.location && <div className="entry-location">{entry.location}</div>}
        </div>
      </div>

      {entry.description && (
        <p className="entry-description">{entry.description}</p>
      )}

      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="entry-bullets">
          {entry.bullets
            .sort((a, b) => a.display_order - b.display_order)
            .map((bullet) => (
              <BulletPoint key={bullet.id} content={bullet.content} />
            ))}
        </ul>
      )}
    </div>
  );
}

export default SectionEntry;
