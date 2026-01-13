import './ResumeTitle.css';

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

interface ResumeTitleProps {
  basicInfo: BasicInfo;
}

function ResumeTitle({ basicInfo }: ResumeTitleProps) {
  const links = [
    basicInfo.phone && {
      url: `tel:${basicInfo.phone}`,
      text: basicInfo.phone
    },
    basicInfo.email && {
      url: `mailto:${basicInfo.email}`,
      text: basicInfo.email
    },
    basicInfo.linkedin_url && {
      url: basicInfo.linkedin_url,
      text: 'LinkedIn'
    },
    basicInfo.website_url && {
      url: basicInfo.website_url,
      text: 'Portfolio'
    }
  ].filter(Boolean);

  return (
    <div className="resume-title">
      <h1 className="resume-name">{basicInfo.full_name}</h1>
      <div className="resume-contact">
        {links.map((link, index) => (
          <span key={index}>
            {typeof link === 'string' ? (
              link
            ) : (
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
            )}
            {index < links.length - 1 && ' | '}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ResumeTitle;
