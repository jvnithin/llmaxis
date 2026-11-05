import type { PromptDetail } from "./detail-data";

export default function PromptDetailHeader({ prompt }: { prompt: PromptDetail }) {
  return (
    <header className="prompt-detail-header">
      <p className="prompt-detail-badge">{prompt.badge}</p>
      <h1>{prompt.title}</h1>
      <p className="prompt-detail-summary">{prompt.summary}</p>
      <ul className="prompt-detail-tags" aria-label="Prompt tags">
        {prompt.tags.map((tag) => (
          <li key={tag.label} className={`is-${tag.tone ?? "mint"}`}>
            {tag.label}
          </li>
        ))}
      </ul>
    </header>
  );
}
