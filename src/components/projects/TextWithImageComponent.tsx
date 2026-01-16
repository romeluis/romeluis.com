import React from 'react';
import MarkdownText from '../shared/MarkdownText';
import './TextWithImageComponent.css';

interface TextWithImageComponentProps {
  title?: string;
  text: string;
  imageUrl: string;
  caption?: string;
  color?: string;
  imagePosition?: 'left' | 'right';
}

const TextWithImageComponent: React.FC<TextWithImageComponentProps> = ({
  title,
  text,
  imageUrl,
  caption,
  color,
  imagePosition = 'right'
}) => {
  return (
    <div className={`text-with-image-component text-with-image-component--${imagePosition}`}>
      <div className="text-with-image-component__image-wrapper" style={{ backgroundColor: color }}>
        <img
          src={imageUrl}
          alt={title || 'Project image'}
          className="text-with-image-component__image"
        />
        {caption && (
          <p className="text-with-image-component__caption">{caption}</p>
        )}
      </div>
      <div className="text-with-image-component__content">
        {title && (
          <h3 className="text-with-image-component__title">{title}</h3>
        )}
        <MarkdownText className="text-with-image-component__text">{text}</MarkdownText>
      </div>
    </div>
  );
};

export default TextWithImageComponent;
