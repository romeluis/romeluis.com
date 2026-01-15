import { useMemo } from 'react';
import './TechStackBadge.css';

interface TechStackBadgeProps {
  techName: string;
  techColor?: string | null;
  projectId: number;
  isParentHovered: boolean;
}

const FALLBACK_COLORS = [
  '#91bf4b', // Green
  '#ffd05d', // Yellow
  '#f26a2d', // Orange
  '#f96ba4', // Pink
  '#02a6ff', // Blue
  '#120e14', // Black
  '#afafaf', // Gray
];

// Seeded random function to ensure consistent colors per project
function getSeededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const randomValue = x - Math.floor(x);
  return min + randomValue * (max - min);
}

function TechStackBadge({ techName, techColor, projectId, isParentHovered }: TechStackBadgeProps) {
  // Use tech stack color if available, otherwise fall back to random color
  // Use tech name + projectId as seed to ensure unique rotations for each badge
  const { color, baseRotation, hoverRotation } = useMemo(() => {
    // Create a unique seed from tech name and project ID
    const techSeed = techName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const uniqueSeed = projectId * 1000 + techSeed;

    const color = techColor || FALLBACK_COLORS[Math.floor(getSeededRandom(uniqueSeed, 0, FALLBACK_COLORS.length))];
    const baseRotation = getSeededRandom(uniqueSeed + 1, -12, 12);
    // Rotate in opposite direction on hover (if CW, go CCW and vice versa)
    const rotationDelta = getSeededRandom(uniqueSeed + 2, 8, 15);
    const hoverRotation = baseRotation - (Math.sign(baseRotation) || 1) * rotationDelta;
    return { color, baseRotation, hoverRotation };
  }, [techName, techColor, projectId]);

  const rotation = isParentHovered ? hoverRotation : baseRotation;

  return (
    <div
      className="tech-stack-badge"
      style={{
        backgroundColor: color,
        borderColor: color,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {techName}
    </div>
  );
}

export default TechStackBadge;
