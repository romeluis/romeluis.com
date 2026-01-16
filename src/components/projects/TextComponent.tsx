import React from 'react';
import MarkdownText from '../shared/MarkdownText';
import './TextComponent.css';

interface TextComponentProps {
  text: string;
  color?: string;
}

const TextComponent: React.FC<TextComponentProps> = ({ text }) => {
  return (
    <div className="text-component">
      <MarkdownText className="text-component__text">{text}</MarkdownText>
    </div>
  );
};

export default TextComponent;
