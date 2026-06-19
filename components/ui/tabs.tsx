"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function Tabs({
  tabs,
  defaultTab,
}: {
  tabs: { key: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);

  return (
    <div>
      <div className="flex gap-1 bg-brand-purple-50/70 p-1 rounded-2xl mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex-1 h-9 rounded-xl text-sm font-medium transition-colors",
              active === tab.key
                ? "bg-white text-brand-purple-700 shadow-soft"
                : "text-brand-purple-400"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.key === active)?.content}
    </div>
  );
}
