import React from 'react';
import './VideoComponent.css';

interface VideoComponentProps {
  videoUrl: string;
  caption?: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videoUrl, caption }) => {
  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <div className="video-component video-component--error">
        <p>Invalid video URL</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-component">
      <div className="video-component__wrapper">
        <iframe
          className="video-component__iframe"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption && (
        <p className="video-component__caption">{caption}</p>
      )}
    </div>
  );
};

export default VideoComponent;
