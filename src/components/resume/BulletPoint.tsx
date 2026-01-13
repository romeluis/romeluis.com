import './BulletPoint.css';

interface BulletPointProps {
  content: string;
}

function BulletPoint({ content }: BulletPointProps) {
  return (
    <li className="bullet-point">
      {content}
    </li>
  );
}

export default BulletPoint;
