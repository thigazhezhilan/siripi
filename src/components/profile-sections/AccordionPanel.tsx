"use client";

import { ReactNode, useState } from "react";

export function AccordionPanel({
  title,
  defaultExpanded,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-sirpi-border">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between bg-sirpi-surface px-4 py-4"
      >
        <span className="text-[15px] font-bold text-sirpi-text">{title}</span>
        <span className="text-lg font-bold text-sirpi-primary">{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? <div className="p-4">{children}</div> : null}
    </div>
  );
}
