import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { TechStackItem } from '../../structures/ProjectInformation';
import './TechStackDisplayComponent.css';

interface TechStackDisplayComponentProps {
  techStack: TechStackItem[];
}

const TechStackDisplayComponent: React.FC<TechStackDisplayComponentProps> = ({ techStack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(0);

  // Duration for one full cycle (left to right or right to left) in ms
  const cycleDuration = 8000;

  if (!techStack || techStack.length === 0) {
    return null;
  }

  const sortedTechStack = [...techStack].sort((a, b) => a.display_order - b.display_order);

  // Ease in-out sine function for smooth animation
  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  const checkOverflow = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollWidth, clientWidth } = container;
    const hasOverflow = scrollWidth > clientWidth;
    setIsOverflowing(hasOverflow);
  }, []);

  const updateFadeVisibility = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const animate = useCallback((timestamp: number) => {
    const container = containerRef.current;
    if (!container || !isOverflowing) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    if (isPaused) {
      // Reset start time when paused so we resume from current position
      startTimeRef.current = null;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Initialize start time on first frame after unpause
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp - (pausedProgressRef.current * cycleDuration * 2);
    }

    const elapsed = timestamp - startTimeRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Progress through full back-and-forth cycle (0 to 2 represents left->right->left)
    const fullCycleProgress = (elapsed % (cycleDuration * 2)) / (cycleDuration * 2);

    // Convert to ping-pong: 0->1 for first half, 1->0 for second half
    let progress: number;
    if (fullCycleProgress < 0.5) {
      progress = fullCycleProgress * 2; // 0 to 1
    } else {
      progress = 1 - ((fullCycleProgress - 0.5) * 2); // 1 to 0
    }

    // Apply easing and calculate scroll position
    const easedProgress = easeInOutSine(progress);
    const scrollPosition = easedProgress * maxScroll;

    // Store progress for resuming after pause
    pausedProgressRef.current = fullCycleProgress;

    container.scrollLeft = scrollPosition;
    updateFadeVisibility();
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isOverflowing, updateFadeVisibility, cycleDuration]);

  useEffect(() => {
    checkOverflow();
    updateFadeVisibility();

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateFadeVisibility();
    };
    const handleResize = () => {
      checkOverflow();
      updateFadeVisibility();
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [techStack, checkOverflow, updateFadeVisibility]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const getPillStyle = (tech: TechStackItem) => {
    if (tech.color) {
      return {
        backgroundColor: tech.color,
        color: '#ffffff',
      };
    }
    return {};
  };

  return (
    <div className="tech-stack-display">
      <h3 className="tech-stack-display__title">Tech Stack</h3>
      <div className="tech-stack-display__wrapper">
        <div className={`tech-stack-display__fade tech-stack-display__fade--left ${showLeftFade ? 'visible' : ''}`} />
        <div
          className={`tech-stack-display__scroll-container ${!isOverflowing ? 'tech-stack-display__scroll-container--centered' : ''}`}
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="tech-stack-display__track">
            {sortedTechStack.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="tech-stack-display__item"
                style={getPillStyle(tech)}
              >
                <span className="tech-stack-display__name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`tech-stack-display__fade tech-stack-display__fade--right ${showRightFade ? 'visible' : ''}`} />
      </div>
    </div>
  );
};

export default TechStackDisplayComponent;
