import React from 'react';
import './TextComponent.css';

interface TextComponentProps {
  text: string;
  color?: string;
}

const TextComponent: React.FC<TextComponentProps> = ({ text }) => {
  return (
    <div className="text-component">
      <p className="text-component__text">{text}</p>
    </div>
  );
};

export default TextComponent;
