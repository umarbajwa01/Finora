import { AlertTriangle } from "lucide-react";
import Button from "./Button";
import "./States.css";

const ErrorState = ({ title = "Unable to load this data", message, onRetry }) => (
  <div className="state-block">
    <div className="state-block__icon state-block__icon--error">
      <AlertTriangle size={24} strokeWidth={1.5} />
    </div>
    <h4 className="font-display">{title}</h4>
    {message && <p>{message}</p>}
    {onRetry && (
      <div className="state-block__action">
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )}
  </div>
);

export default ErrorState;
