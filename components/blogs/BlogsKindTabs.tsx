import { BLOG_KINDS, type BlogKind } from "./data";

type BlogsKindTabsProps = {
  active: BlogKind;
  onChange: (kind: BlogKind) => void;
  counts: Record<BlogKind, number>;
};

export default function BlogsKindTabs({ active, onChange, counts }: BlogsKindTabsProps) {
  return (
    <div className="blogs-kind-tabs-wrap">
      <div className="blogs-kind-tabs" role="tablist" aria-label="Resource type">
        {BLOG_KINDS.map((kind) => {
          const selected = kind === active;
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "is-active" : ""}
              onClick={() => onChange(kind)}
            >
              <span className="blogs-kind-label">{kind}</span>
              <em className="blogs-kind-count">{counts[kind]}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
