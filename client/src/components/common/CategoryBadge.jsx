import { getCategoryMeta } from "../../constants/categories";
import "./CategoryBadge.css";

const CategoryBadge = ({ category, size = "md" }) => {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  return (
    <span className={`category-badge category-badge--${size}`} style={{ "--badge-color": meta.color }}>
      <span className="category-badge__icon">
        <Icon size={size === "sm" ? 13 : 15} strokeWidth={2} />
      </span>
      {meta.label}
    </span>
  );
};

export default CategoryBadge;
