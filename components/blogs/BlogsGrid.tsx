import BlogCard from "./BlogCard";
import type { BlogGuide } from "./data";

export default function BlogsGrid({ guides }: { guides: BlogGuide[] }) {
  if (guides.length === 0) {
    return (
      <div className="blogs-empty" id="guides">
        <h2>No guides match that search.</h2>
        <p>Try another topic, or clear the search to see every roadmap and article.</p>
      </div>
    );
  }

  return (
    <section className="blogs-grid" id="guides" aria-label="Guides">
      {guides.map((guide) => (
        <BlogCard key={guide.id} guide={guide} />
      ))}
    </section>
  );
}
