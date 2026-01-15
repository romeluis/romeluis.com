import React from 'react';
import './TextWithImageComponent.css';

interface TextWithImageComponentProps {
  title?: string;
  text: string;
  imageUrl: string;
  caption?: string;
}

const TextWithImageComponent: React.FC<TextWithImageComponentProps> = ({
  title,
  text,
  imageUrl,
  caption
}) => {
  return (
    <div className="text-with-image-component">
      <div className="text-with-image-component__image-wrapper">
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
        <p className="text-with-image-component__text">{text}</p>
      </div>
    </div>
  );
};

export default TextWithImageComponent;
