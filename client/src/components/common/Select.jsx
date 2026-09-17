import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/cx";
import "./Input.css";
import "./Select.css";

const Select = forwardRef(({ label, error, className, children, ...props }, ref) => (
  <label className={cx("field", className)}>
    {label && <span className="field__label">{label}</span>}
    <span className={cx("select__control", error && "field__control--error")}>
      <select ref={ref} className="select__input" {...props}>
        {children}
      </select>
      <ChevronDown size={16} className="select__chevron" />
    </span>
    {error && <span className="field__error">{error}</span>}
  </label>
));

Select.displayName = "Select";
export default Select;
