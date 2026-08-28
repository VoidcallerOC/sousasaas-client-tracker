"use client";

import { useMemo, useState } from "react";
import type { Client, Status } from "@/lib/types";
import { PIPELINE_STATUSES, STATUSES } from "@/lib/types";
import { StatusBar, statusBadgeClass } from "./status-bar";
import { ClientSheet } from "./client-sheet";
import { BulkSheet } from "./bulk-sheet";

type Filter = "pipeline" | Status | "all";

function money(n: number | null): string | null {
  if (n == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function ClientCard({
  client,
  onOpen,
}: {
  client: Client;
  onOpen: () => void;
}) {
  const bits = [
    money(client.quoted) && `quoted ${money(client.quoted)}`,
    money(client.deposit) && `dep ${money(client.deposit)}`,
    money(client.paid) && `paid ${money(client.paid)}`,
  ].filter(Boolean);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3.5">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-semibold leading-snug text-zinc-50">
            {client.client}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(client.status)}`}
          >
            {client.status}
          </span>
        </div>
        {client.businessType ? (
          <p className="mt-1 text-sm text-zinc-400">{client.businessType}</p>
        ) : null}
        {client.nextAction ? (
          <p className="mt-2 text-sm leading-5 text-zinc-200">
            Next: {client.nextAction}
          </p>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No next action</p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
          {client.phone ? <span>{client.phone}</span> : null}
          {client.lastContacted ? <span>Last {client.lastContacted}</span> : null}
          {client.domain ? <span>{client.domain}</span> : null}
          {bits.length ? <span>{bits.join(" · ")}</span> : null}
        </div>
      </button>
      <div className="mt-3">
        <StatusBar id={client.id} current={client.status} />
      </div>
    </article>
  );
}

function Group({
  title,
  clients,
  onOpen,
  empty,
}: {
  title: string;
  clients: Client[];
  onOpen: (c: Client) => void;
  empty: string;
}) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          {title}
        </h2>
        <span className="text-xs text-zinc-600">{clients.length}</span>
      </div>
      {clients.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-800 px-4 py-6 text-sm text-zinc-600">
          {empty}
        </p>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <ClientCard key={c.id} client={c} onOpen={() => onOpen(c)} />
          ))}
        </div>
      )}
    </section>
  );
}

export function Tracker({ clients }: { clients: Client[] }) {
  const [filter, setFilter] = useState<Filter>("pipeline");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [bulk, setBulk] = useState(false);

  const counts = useMemo(() => {
    const map: Record<Status, number> = {
      Potential: 0,
      Pending: 0,
      Paid: 0,
      Lost: 0,
    };
    for (const c of clients) map[c.status] += 1;
    return map;
  }, [clients]);

  const grouped = useMemo(() => {
    const map: Record<Status, Client[]> = {
      Potential: [],
      Pending: [],
      Paid: [],
      Lost: [],
    };
    for (const c of clients) map[c.status].push(c);
    return map;
  }, [clients]);

  const filters: { id: Filter; label: string }[] = [
    { id: "pipeline", label: "Pipeline" },
    { id: "Potential", label: `Potential ${counts.Potential}` },
    { id: "Pending", label: `Pending ${counts.Pending}` },
    { id: "Paid", label: `Paid ${counts.Paid}` },
    { id: "Lost", label: `Lost ${counts.Lost}` },
    { id: "all", label: "All" },
  ];

  const visible =
    filter === "pipeline" || filter === "all"
      ? clients
      : grouped[filter];

  return (
    <div>
      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`h-10 shrink-0 rounded-full px-3.5 text-sm font-medium ${
                active
                  ? "bg-zinc-100 text-zinc-950"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-300"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filter === "pipeline" ? (
        <>
          {PIPELINE_STATUSES.map((status) => (
            <Group
              key={status}
              title={status}
              clients={grouped[status]}
              onOpen={setEditing}
              empty={`No ${status.toLowerCase()} clients`}
            />
          ))}
          {grouped.Lost.length > 0 ? (
            <p className="mt-6 text-center text-xs text-zinc-600">
              {grouped.Lost.length} Lost — open the Lost filter to review
            </p>
          ) : null}
        </>
      ) : (
        <Group
          title={filter === "all" ? "All clients" : filter}
          clients={filter === "all" ? clients : visible}
          onOpen={setEditing}
          empty="Nothing here yet"
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[390px] gap-2">
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="h-12 flex-1 rounded-xl bg-emerald-400 text-base font-semibold text-zinc-950"
          >
            Add client
          </button>
          <button
            type="button"
            onClick={() => setBulk(true)}
            className="h-12 flex-1 rounded-xl border border-zinc-700 text-base font-medium text-zinc-100"
          >
            Bulk add
          </button>
        </div>
      </div>

      {editing ? (
        <ClientSheet
          mode="edit"
          client={editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {creating ? (
        <ClientSheet mode="create" onClose={() => setCreating(false)} />
      ) : null}
      {bulk ? <BulkSheet onClose={() => setBulk(false)} /> : null}
    </div>
  );
}

export const STATUSES_FOR_UI = STATUSES;
