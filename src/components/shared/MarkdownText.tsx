import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownText.css';

interface MarkdownTextProps {
  children: string;
  className?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ children, className = '' }) => {
  return (
    <div className={`markdown-text ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom paragraph component to remove default margins
          p: ({ children }) => <p>{children}</p>,
          // Ensure links have proper styling
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          // Map strikethrough to underline for underline support
          del: ({ children }) => <u>{children}</u>,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default MarkdownText;
