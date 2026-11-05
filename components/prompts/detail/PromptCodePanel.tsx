"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";

type PromptCodePanelProps = {
  title: string;
  filename: string;
  promptText: string;
};

function renderPromptLines(text: string) {
  return text.split("\n").map((line, index) => {
    const heading = /^(ROLE|TASK|MY CONTEXT|OUTPUT|INPUTS|RULES|FAILURE HANDLING|UNTRUSTED-CONTENT BOUNDARY)\b/.test(
      line,
    );
    const withTokens = line.split(/(\[[^\]]+\])/g).map((part, partIndex) => {
      if (/^\[[^\]]+\]$/.test(part)) {
        return (
          <span key={`${index}-${partIndex}`} className="prompt-token">
            {part}
          </span>
        );
      }
      return <span key={`${index}-${partIndex}`}>{part}</span>;
    });

    return (
      <div key={`${index}-${line}`} className={heading ? "prompt-code-line is-heading" : "prompt-code-line"}>
        {withTokens.length ? withTokens : " "}
      </div>
    );
  });
}

export default function PromptCodePanel({ title, filename, promptText }: PromptCodePanelProps) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => renderPromptLines(promptText), [promptText]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      toast.success("Prompt copied", "Paste it into ChatGPT, Claude, Gemini, or your preferred model.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed", "Select the prompt text and copy it manually.");
    }
  }

  return (
    <section className="prompt-detail-code-section" aria-labelledby="copy-prompt-title">
      <div className="prompt-detail-code-head">
        <h2 id="copy-prompt-title">{title}</h2>
        <button type="button" className="prompt-detail-copy-btn" onClick={handleCopy}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M10 5V3.5A1.5 1.5 0 0 0 8.5 2h-5A1.5 1.5 0 0 0 2 3.5v5A1.5 1.5 0 0 0 3.5 10H5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          {copied ? "Copied" : "Copy full prompt"}
        </button>
      </div>

      <div className="prompt-detail-terminal" aria-label={filename}>
        <div className="prompt-detail-terminal-bar">
          <span className="prompt-detail-dot is-red" />
          <span className="prompt-detail-dot is-yellow" />
          <span className="prompt-detail-dot is-green" />
          <p>{filename}</p>
        </div>
        <pre className="prompt-detail-terminal-body">
          <code>{lines}</code>
        </pre>
      </div>
    </section>
  );
}
