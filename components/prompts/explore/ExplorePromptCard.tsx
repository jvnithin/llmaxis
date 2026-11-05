import Link from "next/link";
import type { ExplorePrompt } from "./explore-data";

type ExplorePromptCardProps = {
  prompt: ExplorePrompt;
};

export default function ExplorePromptCard({ prompt }: ExplorePromptCardProps) {
  return (
    <article className="explore-card" id={prompt.id}>
      <div className="explore-card-top">
        <span className="explore-card-tag">{prompt.subcategoryTitle}</span>
        <span className="explore-card-number">#{prompt.number}</span>
      </div>
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <div className="explore-card-footer">
        <span>
          {prompt.level} · {prompt.time}
        </span>
        <Link href={`/prompts/${prompt.slug}`} className="explore-card-link">
          View prompt ↗
        </Link>
      </div>
    </article>
  );
}
