import Link from "next/link";
import type { PromptDetail } from "./detail-data";

export default function PromptDetailsCard({ prompt }: { prompt: PromptDetail }) {
  return (
    <aside className="prompt-detail-side-card">
      <h2>Prompt details</h2>
      <dl className="prompt-detail-meta">
        <div>
          <dt>Best for</dt>
          <dd>{prompt.bestFor}</dd>
        </div>
        <div>
          <dt>Difficulty</dt>
          <dd>{prompt.level}</dd>
        </div>
        <div>
          <dt>Est. reading time</dt>
          <dd>{prompt.time}</dd>
        </div>
        <div>
          <dt>Platforms</dt>
          <dd>{prompt.platforms}</dd>
        </div>
      </dl>
      <Link href={prompt.resourceHref} className="prompt-detail-resource">
        {prompt.resourceLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
