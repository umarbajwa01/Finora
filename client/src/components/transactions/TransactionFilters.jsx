import { Search, SlidersHorizontal } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../constants/categories";
import "./TransactionFilters.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
];

const TransactionFilters = ({ filters, onChange }) => {
  const categories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].filter(
    (c, idx, arr) => arr.findIndex((x) => x.value === c.value) === idx
  );

  const set = (patch) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="tx-filters">
      <div className="tx-filters__search">
        <Search size={16} />
        <input
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
        />
      </div>

      <div className="tx-filters__row">
        <div className="tx-filters__pills">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              className={`tx-filters__pill${filters.type === t ? " is-active" : ""}`}
              onClick={() => set({ type: t })}
            >
              {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>

        <div className="tx-filters__selects">
          <select value={filters.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
