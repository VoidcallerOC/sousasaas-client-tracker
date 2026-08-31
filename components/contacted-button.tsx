"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setContacted } from "@/app/actions";

export function ContactedButton({
  id,
  contacted,
}: {
  id: string;
  contacted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (isPending) return;

    startTransition(async () => {
      await setContacted(id, !contacted);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      disabled={isPending}
      aria-pressed={contacted}
      aria-label={contacted ? "Mark client as not contacted" : "Mark client as contacted"}
      className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-60 ${
        contacted
          ? "bg-violet-400 text-zinc-950"
          : "border border-violet-400/40 bg-violet-400/10 text-violet-200"
      }`}
    >
      {isPending ? "Saving…" : "Contacted"}
    </button>
  );
}
