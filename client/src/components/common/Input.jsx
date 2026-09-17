import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "../../utils/cx";
import "./Input.css";

const Input = forwardRef(
  ({ label, error, icon: Icon, type = "text", className, hint, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <label className={cx("field", className)}>
        {label && <span className="field__label">{label}</span>}
        <span className={cx("field__control", error && "field__control--error", Icon && "field__control--icon")}>
          {Icon && <Icon size={16} className="field__icon" />}
          <input ref={ref} type={resolvedType} className="field__input" {...props} />
          {isPassword && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </span>
        {error && <span className="field__error">{error}</span>}
        {!error && hint && <span className="field__hint">{hint}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
export default Input;
