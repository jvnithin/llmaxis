import PromptCodePanel from "./PromptCodePanel";
import PromptDetailHeader from "./PromptDetailHeader";
import PromptDetailsCard from "./PromptDetailsCard";
import PromptPrepareBanner from "./PromptPrepareBanner";
import PromptRelatedCard from "./PromptRelatedCard";
import { getRelatedPrompts, type PromptDetail } from "./detail-data";
import "./prompt-detail.css";

export default function PromptDetailView({ prompt }: { prompt: PromptDetail }) {
  const related = getRelatedPrompts(prompt.id);

  return (
    <main className="prompts-page prompt-detail-page">
      <div className="prompts-shell prompt-detail-shell">
        <div className="prompt-detail-layout">
          <article className="prompt-detail-main">
            <PromptDetailHeader prompt={prompt} />

            <section className="prompt-detail-block" aria-labelledby="helps-title">
              <h2 id="helps-title">What this prompt helps you do</h2>
              <ul className="prompt-detail-bullets">
                {prompt.helps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="prompt-detail-block" aria-labelledby="audience-title">
              <h2 id="audience-title">Who is this for?</h2>
              <p>{prompt.audience}</p>
            </section>

            <PromptPrepareBanner title={prompt.prepareTitle} body={prompt.prepareBody} />

            <PromptCodePanel
              title="Copy the complete prompt"
              filename={prompt.promptFilename}
              promptText={prompt.promptText}
            />

            <section className="prompt-detail-block" aria-labelledby="example-title">
              <h2 id="example-title">Example of useful context</h2>
              <div className="prompt-detail-example">
                <p>{prompt.exampleContext}</p>
              </div>
            </section>

            <section className="prompt-detail-block" aria-labelledby="stronger-title">
              <h2 id="stronger-title">How to get a stronger result</h2>
              <ol className="prompt-detail-steps">
                {prompt.strongerResults.map((item, index) => (
                  <li key={item}>
                    <span aria-hidden="true">{index + 1}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="prompt-detail-block" aria-labelledby="tips-title">
              <h2 id="tips-title">Pro tips</h2>
              <ul className="prompt-detail-bullets">
                {prompt.proTips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <p className="prompt-detail-privacy">{prompt.privacyNote}</p>
          </article>

          <div className="prompt-detail-sidebar">
            <PromptDetailsCard prompt={prompt} />
            <PromptRelatedCard prompts={related} />
          </div>
        </div>
      </div>
    </main>
  );
}
