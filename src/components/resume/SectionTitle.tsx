import './SectionTitle.css';

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <div className="section-divider"></div>
    </div>
  );
}

export default SectionTitle;
