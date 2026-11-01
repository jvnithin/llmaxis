type BlogsHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onExplore: () => void;
};

const METRICS = [
  { icon: "/images/blogs/5bdb7.svg", label: "180+ Enterprise Architecture Guides" },
  { icon: "/images/blogs/86477.svg", label: "100% Free Verifiable Credentials" },
  { icon: "/images/blogs/cc3cd.svg", label: "62,000+ Active Engineers" },
];

export default function BlogsHero({ query, onQueryChange, onExplore }: BlogsHeroProps) {
  return (
    <header className="blogs-hero">
      <p className="blogs-eyebrow">
        <span className="blogs-eyebrow-mark" aria-hidden="true" />
        Expand your horizons • Free resources & guides
      </p>
      <h1>
        <span>Master Next-Gen Tech.</span>
        <span className="blogs-hero-accent">Real-World Guides,</span>
        <span className="blogs-hero-accent">Roadmaps & Free Courses.</span>
      </h1>
      <p className="blogs-hero-copy">
        Curated learning paths, industry-tested roadmaps, and hands-on tutorials built
        <br />
        by frontier AI practitioners and top software architects.
      </p>
      <form
        className="blogs-search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onExplore();
        }}
      >
        <label className="blogs-sr" htmlFor="blogs-search">
          Search guides
        </label>
        <img src="/images/blogs/495f5.svg" alt="" />
        <input
          id="blogs-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search topics, tutorials, roadmaps, e.g., Agentic AI, AI Security..."
          autoComplete="off"
        />
        <button type="submit">
          Explore
          <img src="/images/blogs/28520.svg" alt="" />
        </button>
      </form>
      <ul className="blogs-metrics">
        {METRICS.map((metric) => (
          <li key={metric.label}>
            <img src={metric.icon} alt="" />
            <span>{metric.label}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
