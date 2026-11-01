import { BLOG_FILTERS, type BlogFilter } from "./data";

type BlogsFiltersProps = {
  active: BlogFilter;
  onChange: (filter: BlogFilter) => void;
};

export default function BlogsFilters({ active, onChange }: BlogsFiltersProps) {
  return (
    <div className="blogs-filters" role="tablist" aria-label="Guide topics">
      {BLOG_FILTERS.map((filter) => {
        const selected = filter === active;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? "is-active" : ""}
            onClick={() => onChange(filter)}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
