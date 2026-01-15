import './PinIndicator.css';

interface PinIndicatorProps {
  isPinned: boolean;
}

function PinIndicator({ isPinned }: PinIndicatorProps) {
  if (!isPinned) return null;

  return (
    <div className="pin-indicator" aria-label="Pinned project">
      <img
        src="/Pin Symbol.svg"
        alt=""
        className="pin-indicator-icon"
        aria-hidden="true"
      />
    </div>
  );
}

export default PinIndicator;
