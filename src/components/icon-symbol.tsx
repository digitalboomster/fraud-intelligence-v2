"use client";

export function IconSymbol({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <rect x="3" y="3" width="6" height="6" rx="1.5" />
          <rect x="11" y="3" width="6" height="4" rx="1.5" />
          <rect x="3" y="11" width="6" height="6" rx="1.5" />
          <rect x="11" y="9" width="6" height="8" rx="1.5" />
        </svg>
      );
    case "alerts":
    case "notify":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M10 3.5a3.5 3.5 0 0 0-3.5 3.5v2.1c0 .7-.2 1.4-.6 2l-1 1.5h10.2l-1-1.5a3.7 3.7 0 0 1-.6-2V7A3.5 3.5 0 0 0 10 3.5Z" />
          <path d="M8 14.6a2.2 2.2 0 0 0 4 0" />
        </svg>
      );
    case "case":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <rect x="4" y="5" width="12" height="11" rx="2" />
          <path d="M7 5.5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
        </svg>
      );
    case "entity":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <circle cx="9" cy="9" r="4.5" />
          <path d="m12.5 12.5 4 4" />
        </svg>
      );
    case "reporting":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M5 15V9" />
          <path d="M10 15V5" />
          <path d="M15 15v-7" />
        </svg>
      );
    case "audit":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M10 3.5 15.5 6v4.5c0 2.7-1.5 4.9-5.5 6-4-1.1-5.5-3.3-5.5-6V6L10 3.5Z" />
        </svg>
      );
    case "back":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="m11.5 4.5-5 5 5 5" />
          <path d="M6.5 9.5h8" />
        </svg>
      );
    case "help":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M7.8 7.2a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.4 1.2-1.4 2.4" />
          <circle cx="10" cy="14.6" r=".8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <circle cx="10" cy="10" r="2.3" />
          <path d="M10 4.2v1.5M10 14.3v1.5M4.2 10h1.5M14.3 10h1.5M5.9 5.9l1 1M13.1 13.1l1 1M14.1 5.9l-1 1M6.9 13.1l-1 1" />
        </svg>
      );
    case "external":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M8 5h7v7" />
          <path d="M15 5 7 13" />
        </svg>
      );
    case "analysis":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M4.5 14.5h11" />
          <path d="M6 12V8" />
          <path d="M10 12V5.5" />
          <path d="M14 12V9.5" />
        </svg>
      );
    case "controls":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <path d="M5 5h10v10H5Z" />
          <path d="M10 5v10M5 10h10" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="4.5" />
          <path d="m12.2 12.2 4 4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" className="iconSvg" aria-hidden="true">
          <circle cx="10" cy="10" r="4" />
        </svg>
      );
  }
}
