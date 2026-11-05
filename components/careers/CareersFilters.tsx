import {
  CAREER_DEPARTMENTS,
  roleCountForDepartment,
  type CareerDepartment,
} from "./data";

type CareersFiltersProps = {
  active: CareerDepartment;
  onChange: (department: CareerDepartment) => void;
};

export default function CareersFilters({ active, onChange }: CareersFiltersProps) {
  return (
    <div className="careers-filters" role="tablist" aria-label="Filter by department">
      {CAREER_DEPARTMENTS.map((department) => {
        const isActive = active === department.id;
        const filled = Boolean(department.filled);

        return (
          <button
            key={department.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={filled}
            className={[
              "careers-filter",
              isActive ? "is-active" : "",
              filled ? "is-filled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              if (!filled) onChange(department.id);
            }}
          >
            <span className="careers-filter-label">{department.label}</span>
            {filled ? (
              <span className="careers-filter-filled">
                Positions
                <br />
                Filled
              </span>
            ) : (
              <span className="careers-filter-count">
                {roleCountForDepartment(department.id)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
