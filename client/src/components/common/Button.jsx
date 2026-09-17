import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cx } from "../../utils/cx";
import "./Button.css";

const Button = forwardRef(
  ({ variant = "primary", size = "md", loading, icon: Icon, iconPosition = "left", className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cx("btn", `btn--${variant}`, `btn--${size}`, loading && "btn--loading", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn__spinner" size={16} />
      ) : (
        Icon && iconPosition === "left" && <Icon size={16} />
      )}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
