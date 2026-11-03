type BlogsFiltersProps = {
  filters: readonly string[];
  active: string;
  onChange: (filter: string) => void;
  label?: string;
};

export default function BlogsFilters({
  filters,
  active,
  onChange,
  label = "Guide topics",
}: BlogsFiltersProps) {
  return (
    <div className="blogs-filters" role="tablist" aria-label={label}>
      {filters.map((filter) => {
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
