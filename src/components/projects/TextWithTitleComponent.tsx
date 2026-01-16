import React from 'react';
import MarkdownText from '../shared/MarkdownText';
import './TextWithTitleComponent.css';

interface TextWithTitleComponentProps {
  title: string;
  text: string;
  color: string;
}

const TextWithTitleComponent: React.FC<TextWithTitleComponentProps> = ({ title, text, color }) => {
  return (
    <div className="text-with-title-component" style={{ backgroundColor: color }}>
      <h3 className="text-with-title-component__title">{title}</h3>
      <MarkdownText className="text-with-title-component__text">{text}</MarkdownText>
    </div>
  );
};

export default TextWithTitleComponent;
