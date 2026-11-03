"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import ExternalLinkModal from "./ExternalLinkModal";

type ExternalLinkContextValue = {
  confirmExternal: (href: string) => void;
};

const ExternalLinkContext = createContext<ExternalLinkContextValue | null>(null);

export function useExternalLink() {
  const value = useContext(ExternalLinkContext);
  if (!value) {
    throw new Error("useExternalLink must be used inside ExternalLinkProvider");
  }
  return value;
}

export default function ExternalLinkProvider({ children }: { children: ReactNode }) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!pendingHref) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPendingHref(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pendingHref]);

  const confirmExternal = useCallback((href: string) => {
    setPendingHref(href);
  }, []);

  const value = useMemo(() => ({ confirmExternal }), [confirmExternal]);

  return (
    <ExternalLinkContext.Provider value={value}>
      {children}
      {mounted && pendingHref
        ? createPortal(
            <ExternalLinkModal
              key={titleId}
              href={pendingHref}
              onCancel={() => setPendingHref(null)}
              onContinue={() => {
                const href = pendingHref;
                setPendingHref(null);
                window.open(href, "_blank", "noopener,noreferrer");
              }}
            />,
            document.body,
          )
        : null}
    </ExternalLinkContext.Provider>
  );
}
