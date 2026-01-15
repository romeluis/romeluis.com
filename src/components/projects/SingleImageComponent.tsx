import React from 'react';
import './SingleImageComponent.css';

interface SingleImageComponentProps {
  imageUrl: string;
  caption?: string;
}

const SingleImageComponent: React.FC<SingleImageComponentProps> = ({ imageUrl, caption }) => {
  return (
    <div className="single-image-component">
      <div className="single-image-component__wrapper">
        <img
          src={imageUrl}
          alt={caption || 'Project image'}
          className="single-image-component__image"
        />
        {caption && (
          <div className="single-image-component__caption">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleImageComponent;
