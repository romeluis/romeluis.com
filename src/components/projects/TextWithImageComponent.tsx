import React, { useRef, useEffect, useState } from 'react';
import MarkdownText from '../shared/MarkdownText';
import './TextWithImageComponent.css';

interface TextWithImageComponentProps {
  title?: string;
  text: string;
  imageUrl: string;
  caption?: string;
  color?: string;
  imagePosition?: 'left' | 'right';
  mediaType?: 'image' | 'video';
}

// Helper to detect media type from URL extension as fallback
const getMediaTypeFromUrl = (url: string): 'image' | 'video' => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v'];
  const lowercaseUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowercaseUrl.endsWith(ext)) ? 'video' : 'image';
};

const TextWithImageComponent: React.FC<TextWithImageComponentProps> = ({
  title,
  text,
  imageUrl,
  caption,
  color,
  imagePosition = 'right',
  mediaType
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  // Determine effective media type (use prop or detect from URL)
  const effectiveMediaType = mediaType || getMediaTypeFromUrl(imageUrl);
  const isVideo = effectiveMediaType === 'video';

  // IntersectionObserver for video autoplay
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [isVideo]);

  // Play/pause video based on viewport visibility
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (isInViewport) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser - silent fail is acceptable
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInViewport, isVideo]);

  return (
    <div className={`text-with-image-component text-with-image-component--${imagePosition}`}>
      <div
        className={`text-with-image-component__image-wrapper ${isVideo ? 'text-with-image-component__image-wrapper--video' : ''}`}
        style={{ backgroundColor: isVideo ? 'transparent' : color }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={imageUrl}
            className="text-with-image-component__video"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={imageUrl}
            alt={title || 'Project image'}
            className="text-with-image-component__image"
          />
        )}
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
