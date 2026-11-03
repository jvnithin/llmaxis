"use client";

import type { ReactNode, MouseEvent } from "react";
import { isExternalHref } from "@/lib/externalLink";
import { useExternalLink } from "./ExternalLinkProvider";

type GuideExternalLinkProps = {
  href: string;
  children: ReactNode;
};

export default function GuideExternalLink({ href, children }: GuideExternalLinkProps) {
  const { confirmExternal } = useExternalLink();
  const external = isExternalHref(href);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!external) return;
    event.preventDefault();
    confirmExternal(href);
  }

  return (
    <a
      href={href}
      onClick={onClick}
      {...(external
        ? { rel: "noopener noreferrer" }
        : href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
    >
      {children}
    </a>
  );
}
