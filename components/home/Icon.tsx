import React from "react";

export type IconName =
  | "arrow"
  | "briefcase"
  | "building"
  | "check"
  | "code"
  | "community"
  | "consulting"
  | "education"
  | "menu"
  | "mentors"
  | "spark"
  | "training"
  | "value"
  | "x";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 22, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5l8-3v19M12 8h8v13M8 7v1M8 11v1M8 15v1M16 12v1M16 16v1M2 21h20" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    code: <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />,
    community: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2" />
        <path d="M3 20c0-4 2.5-7 6-7s6 3 6 7M15 15c3 0 5 2 5 5" />
      </>
    ),
    consulting: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2M8 3.8 6.5 2M16 3.8 17.5 2" />
      </>
    ),
    education: (
      <>
        <path d="m2 9 10-5 10 5-10 5L2 9Z" />
        <path d="M6 11.5V16c3 2.5 9 2.5 12 0v-4.5M22 9v6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    mentors: (
      <>
        <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <path d="M12 2c.7 5.3 4.7 9.3 10 10-5.3.7-9.3 4.7-10 10-.7-5.3-4.7-9.3-10-10 5.3-.7 9.3-4.7 10-10Z" />
    ),
    training: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 22h8M12 18v4M8 10l2.5 2.5L16 7" />
      </>
    ),
    value: (
      <>
        <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />
        <path d="M9 12h6M12 9v6" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
