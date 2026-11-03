import BlogCard from "./BlogCard";
import type { BlogGuide } from "./data";

export default function BlogsGrid({
  guides,
  emptyLabel = "guides",
}: {
  guides: BlogGuide[];
  emptyLabel?: string;
}) {
  if (guides.length === 0) {
    return (
      <div className="blogs-empty" id="guides">
        <h2>No {emptyLabel} match that search.</h2>
        <p>Try another topic, or clear the search to see every available item.</p>
      </div>
    );
  }

  return (
    <section className="blogs-grid" id="guides" aria-label={emptyLabel}>
      {guides.map((guide) => (
        <BlogCard key={guide.id} guide={guide} />
      ))}
    </section>
  );
}
