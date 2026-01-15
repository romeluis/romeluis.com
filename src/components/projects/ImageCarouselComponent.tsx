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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, isTransitioning]);

  const transitionTo = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;

    setIsTransitioning(true);

    // After fade out, change the image
    setTimeout(() => {
      setDisplayIndex(newIndex);
      setCurrentIndex(newIndex);
      // Allow fade in to complete before enabling transitions again
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  const goToNext = () => {
    transitionTo((currentIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    transitionTo((currentIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    transitionTo(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const displayImage = images[displayIndex];

  return (
    <div className="image-carousel">
      <div className="image-carousel__container" style={{ backgroundColor: color }}>
        <div className="image-carousel__image-wrapper">
          <img
            src={displayImage.image_url}
            alt={displayImage.caption || `Slide ${displayIndex + 1}`}
            className={`image-carousel__image ${isTransitioning ? 'image-carousel__image--fade-out' : ''}`}
          />

          {displayImage.caption && (
            <p className={`image-carousel__caption ${isTransitioning ? 'image-carousel__image--fade-out' : ''}`}>
              {displayImage.caption}
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
