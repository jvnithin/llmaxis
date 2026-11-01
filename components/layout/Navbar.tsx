"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./navbar.css";

function canHoverResources() {
  return window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 781px)").matches;
}

const SHOW_RESOURCES_NAV = false;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [blogsOpen, setBlogsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blogsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isLearning = pathname === "/learning" || pathname === "/programs";

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openResources = () => {
    clearCloseTimer();
    setResourcesOpen(true);
  };

  const scheduleCloseResources = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setResourcesOpen(false);
      setBlogsOpen(false);
    }, 180);
  };

  const clearBlogsTimer = () => {
    if (blogsTimer.current) {
      clearTimeout(blogsTimer.current);
      blogsTimer.current = null;
    }
  };

  const openBlogs = () => {
    clearBlogsTimer();
    setBlogsOpen(true);
  };

  const scheduleCloseBlogs = () => {
    clearBlogsTimer();
    blogsTimer.current = setTimeout(() => setBlogsOpen(false), 140);
  };

  useEffect(() => {
    setOpen(false);
    setResourcesOpen(false);
    setBlogsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!resourcesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!resourcesRef.current?.contains(event.target as Node)) {
        setResourcesOpen(false);
        setBlogsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [resourcesOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (blogsTimer.current) clearTimeout(blogsTimer.current);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Brand Logo (from newllm2) */}
        <Link className="brand" href="/" aria-label="LLM Axis home">
          <Image
            src="/MainLogo.png"
            alt="LLM Axis"
            width={130}
            height={47}
            priority
            className="brand-logo"
          />
        </Link>

        {/* Center Nav Links (Previous sections: Our Programs, Hire Talent, Contact Us) */}
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className={pathname === "/" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/learning"
            className={isLearning ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Our Programs
          </Link>
          {SHOW_RESOURCES_NAV ? <div
            className={`nav-dropdown${resourcesOpen ? " is-open" : ""}${pathname.startsWith("/blogs") ? " is-current" : ""}`}
            ref={resourcesRef}
            onMouseEnter={() => {
              if (canHoverResources()) openResources();
            }}
            onMouseLeave={() => {
              if (!canHoverResources()) return;
              scheduleCloseResources();
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                clearCloseTimer();
                setResourcesOpen(false);
                setBlogsOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setResourcesOpen(false);
                setBlogsOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="nav-dropdown-toggle"
              aria-expanded={resourcesOpen}
              aria-haspopup="true"
              aria-controls="resources-menu"
              onFocus={() => {
                if (canHoverResources()) openResources();
              }}
              onClick={() => {
                if (canHoverResources()) {
                  openResources();
                  return;
                }
                setResourcesOpen((current) => {
                  if (current) setBlogsOpen(false);
                  return !current;
                });
              }}
            >
              Resources
              <svg
                className="nav-chevron"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              id="resources-menu"
              className="resources-panel"
              aria-hidden={!resourcesOpen}
            >
              <div className="resources-panel-card">
                <p className="resources-kicker">Resources</p>
                <div className="resources-grid">
                  <button type="button" className="resource-card">
                    <span className="resource-icon resource-icon-map" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18 3 16V4l6 2 6-2 6 2v12l-6-2-6 2z" />
                        <path d="M9 6v12M15 4v12" />
                      </svg>
                    </span>
                    Free Roadmaps
                  </button>
                  <button type="button" className="resource-card">
                    <span className="resource-icon resource-icon-prompt" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                        <circle cx="12" cy="12" r="3.2" />
                      </svg>
                    </span>
                    Free Prompts
                  </button>
                  <button type="button" className="resource-card">
                    <span className="resource-icon resource-icon-course" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M3 10h18M8 3v4M16 3v4" />
                      </svg>
                    </span>
                    Free Courses/Sessions
                  </button>
                  <div
                    className={blogsOpen ? "blogs-card is-open" : "blogs-card"}
                    onMouseEnter={() => {
                      if (canHoverResources()) openBlogs();
                    }}
                    onMouseLeave={() => {
                      if (canHoverResources()) scheduleCloseBlogs();
                    }}
                  >
                    <div className="resource-card blogs-resource">
                      <Link
                        href="/blogs"
                        className="blogs-open-link"
                        onClick={() => setOpen(false)}
                      >
                        <span className="resource-icon resource-icon-blog" aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 3v5h5M8 13h8M8 17h5" />
                          </svg>
                        </span>
                        <span className="resource-card-label">Blogs</span>
                      </Link>
                      <button
                        type="button"
                        className="blogs-chevron-btn"
                        aria-label={blogsOpen ? "Hide blog sections" : "Show blog sections"}
                        aria-expanded={blogsOpen}
                        aria-controls="blogs-menu"
                        onFocus={openBlogs}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (canHoverResources()) {
                            openBlogs();
                            return;
                          }
                          setBlogsOpen((current) => !current);
                        }}
                      >
                        <svg
                          className="resource-chevron"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                    <div
                      id="blogs-menu"
                      className="blogs-flyout"
                      aria-hidden={!blogsOpen}
                    >
                      <div className="blogs-flyout-card">
                        <Link href="/blogs" onClick={() => setOpen(false)}>
                          Roadmaps
                        </Link>
                        <Link href="/blogs" onClick={() => setOpen(false)}>
                          Articles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : null}
          <Link
            href="/hire"
            className={pathname === "/hire" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Hire Talent
          </Link>
          <Link
            href="/contact"
            className={pathname === "/contact" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>

          {/* Mobile-only CTA in dropdown */}
          <Link
            href={isLearning ? "#enroll" : "/learning"}
            className="nav-mobile-cta"
            style={{ display: "none" }}
            onClick={() => setOpen(false)}
          >
            Get Started →
          </Link>
        </nav>

        {/* Desktop CTA Button (Get Started with arrow icon) */}
        <Link
          className="button-nav"
          href={isLearning ? "#enroll" : "/learning"}
          onClick={() => setOpen(false)}
        >
          Get Started
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => {
            setOpen((current) => {
              if (current) {
                setResourcesOpen(false);
                setBlogsOpen(false);
              }
              return !current;
            });
          }}
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
