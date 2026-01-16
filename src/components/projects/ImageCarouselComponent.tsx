import React, { useState, useEffect } from 'react';
import './ImageCarouselComponent.css';

interface CarouselImage {
  image_url: string;
  caption?: string;
}

interface ImageCarouselComponentProps {
  images: CarouselImage[];
  color: string;
}

const ImageCarouselComponent: React.FC<ImageCarouselComponentProps> = ({ images, color }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="image-carousel">
      <div className="image-carousel__container" style={{ backgroundColor: color }}>
        <div className="image-carousel__image-wrapper">
          <img
            src={currentImage.image_url}
            alt={currentImage.caption || `Slide ${currentIndex + 1}`}
            className="image-carousel__image"
          />

          {currentImage.caption && (
            <p className="image-carousel__caption">
              {currentImage.caption}
            </p>
          )}

          {images.length > 1 && (
            <div className="image-carousel__dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`image-carousel__dot ${
                    index === currentIndex ? 'image-carousel__dot--active' : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselComponent;
