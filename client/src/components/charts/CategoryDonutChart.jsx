import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getCategoryMeta } from "../../constants/categories";
import { formatCompactCurrency } from "../../utils/formatters";
import "./CategoryDonutChart.css";

const resolveColor = (cssVar) => {
  if (typeof window === "undefined") return "#b89b62";
  const value = cssVar.match(/var\((--[\w-]+)\)/)?.[1];
  if (!value) return cssVar;
  return getComputedStyle(document.documentElement).getPropertyValue(value).trim() || "#b89b62";
};

const CategoryDonutChart = ({ data = [], currency = "USD" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = data[activeIndex];

  if (data.length === 0) {
    return <div className="donut-empty">No spending data for this period yet.</div>;
  }

  return (
    <div className="category-donut">
      <div className="category-donut__chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={3}
              cornerRadius={4}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onClick={(_, idx) => setActiveIndex(idx)}
              animationDuration={700}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={entry.category}
                  fill={resolveColor(getCategoryMeta(entry.category).color)}
                  opacity={idx === activeIndex ? 1 : 0.45}
                  stroke="none"
                  style={{ cursor: "pointer", transition: "opacity .2s ease" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="category-donut__center">
          <span className="category-donut__center-value font-display">
            {formatCompactCurrency(active?.total, currency)}
          </span>
          <span className="category-donut__center-label">{active?.category}</span>
        </div>
      </div>

      <ul className="category-donut__legend">
        {data.map((entry, idx) => {
          const meta = getCategoryMeta(entry.category);
          const Icon = meta.icon;
          return (
            <li
              key={entry.category}
              className={`category-donut__legend-item${idx === activeIndex ? " is-active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className="category-donut__legend-icon" style={{ background: meta.color }}>
                <Icon size={13} />
              </span>
              <span className="category-donut__legend-name">{meta.label}</span>
              <span className="category-donut__legend-pct">{entry.percentage}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryDonutChart;
