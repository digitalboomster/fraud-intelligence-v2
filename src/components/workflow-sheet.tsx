"use client";

import { type ReactNode, useEffect } from "react";

export function WorkflowSheet({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="sheetBackdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="sheetPanel" role="dialog" aria-modal="true" aria-labelledby="workflow-sheet-title">
        <div className="sheetHead">
          <h2 id="workflow-sheet-title">{title}</h2>
          <button type="button" className="ghostBtn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="sheetBody">{children}</div>
      </div>
    </div>
  );
}
