"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import ExternalLinkProvider from "@/components/blogs/guide/external-link/ExternalLinkProvider";
import GuideMobileActions from "@/components/blogs/guide/GuideMobileActions";

type TocItem = { id: string; text: string; level: 2 | 3 | 4 };

export default function GuideFrame({
  title,
  description,
  toc,
  body,
  aside,
}: {
  title: string;
  description: string;
  toc: TocItem[];
  body: ReactNode;
  aside: ReactNode;
}) {
  const [active, setActive] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -55% 0px", threshold: [0, 1] },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <ExternalLinkProvider>
      <main className="guide-page">
        <div className="guide-shell">
          <p className="guide-crumb">
            <Link href="/blogs">Guides</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </p>
          <div className="guide-layout">
            <nav className="guide-toc" aria-label="Contents">
              <p>Contents</p>
              <ol>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={[
                        item.id === active ? "is-active" : "",
                        item.level === 3 ? "is-sub" : "",
                        item.level === 4 ? "is-deep" : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined}
                      onClick={() => setActive(item.id)}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <article className="guide-article">
              <header>
                <h1>{title}</h1>
                {description ? <p key="guide-description">{description}</p> : null}
              </header>
              {body}
            </article>
            {aside}
          </div>
        </div>
        <GuideMobileActions />
      </main>
    </ExternalLinkProvider>
  );
}
