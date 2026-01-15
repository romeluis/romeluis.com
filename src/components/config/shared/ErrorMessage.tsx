import './ErrorMessage.css';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      <div className="error-actions">
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button onClick={onDismiss} variant="secondary">
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
