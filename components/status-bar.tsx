"use client";

import { STATUSES, type Status } from "@/lib/types";
import { setStatus } from "@/app/actions";

const STYLES: Record<Status, { on: string; off: string }> = {
  Potential: {
    on: "bg-sky-400 text-zinc-950",
    off: "bg-zinc-900 text-sky-300 border border-zinc-800",
  },
  Pending: {
    on: "bg-amber-400 text-zinc-950",
    off: "bg-zinc-900 text-amber-300 border border-zinc-800",
  },
  Paid: {
    on: "bg-emerald-400 text-zinc-950",
    off: "bg-zinc-900 text-emerald-300 border border-zinc-800",
  },
  Lost: {
    on: "bg-zinc-400 text-zinc-950",
    off: "bg-zinc-900 text-zinc-400 border border-zinc-800",
  },
};

export function StatusBar({
  id,
  current,
}: {
  id: string;
  current: Status;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {STATUSES.map((status) => {
        const active = status === current;
        return (
          <button
            key={status}
            type="button"
            onClick={() => {
              if (!active) void setStatus(id, status);
            }}
            className={`h-12 rounded-xl text-[11px] font-semibold ${
              active ? STYLES[status].on : STYLES[status].off
            }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}

export function statusBadgeClass(status: Status): string {
  switch (status) {
    case "Potential":
      return "bg-sky-400/15 text-sky-300";
    case "Pending":
      return "bg-amber-400/15 text-amber-300";
    case "Paid":
      return "bg-emerald-400/15 text-emerald-300";
    case "Lost":
      return "bg-zinc-400/15 text-zinc-400";
  }
}
