import Link from "next/link";
import type { PopularPrompt } from "../data";

type PromptRelatedCardProps = {
  prompts: PopularPrompt[];
};

export default function PromptRelatedCard({ prompts }: PromptRelatedCardProps) {
  return (
    <aside className="prompt-detail-side-card">
      <h2>More in this collection</h2>
      <ul className="prompt-detail-related">
        {prompts.map((prompt) => (
          <li key={prompt.id}>
            <Link href={`/prompts/${prompt.id}`}>
              <strong>{prompt.title}</strong>
              <span>
                {prompt.level} · {prompt.time}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/prompts#popular-prompts" className="prompt-detail-explore">
        Explore all prompts and find customized training for your team
      </Link>
    </aside>
  );
}
