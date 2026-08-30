"use server";

import { revalidatePath } from "next/cache";
import { emptyClient, isStatus, type Client, type Status } from "@/lib/types";
import { readClients, writeClients, resetToShippedSeed } from "@/lib/storage";

function parseMoney(value: FormDataEntryValue | null): number | null {
  if (value == null) return null;
  const cleaned = String(value).trim().replace(/[$,]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function field(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function clientFromForm(formData: FormData, id: string): Client {
  const statusRaw = field(formData, "status");
  const status: Status = isStatus(statusRaw) ? statusRaw : "Potential";
  return {
    id,
    client: field(formData, "client"),
    businessType: field(formData, "businessType"),
    status,
    contactName: field(formData, "contactName"),
    phone: field(formData, "phone"),
    email: field(formData, "email"),
    address: field(formData, "address"),
    quoted: parseMoney(formData.get("quoted")),
    deposit: parseMoney(formData.get("deposit")),
    paid: parseMoney(formData.get("paid")),
    githubRepo: field(formData, "githubRepo"),
    liveUrl: field(formData, "liveUrl"),
    domain: field(formData, "domain"),
    nextAction: field(formData, "nextAction"),
    notes: field(formData, "notes"),
    lastContacted: field(formData, "lastContacted"),
  };
}

export async function saveClient(formData: FormData) {
  const id = field(formData, "id");
  if (!id) return;
  const next = clientFromForm(formData, id);
  if (!next.client) return;
  const clients = await readClients();
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1) {
    clients.unshift(next);
  } else {
    clients[idx] = next;
  }
  await writeClients(clients);
  revalidatePath("/");
}

export async function createClient(formData: FormData) {
  const id = crypto.randomUUID();
  const next = clientFromForm(formData, id);
  if (!next.client) return;
  const clients = await readClients();
  clients.unshift(next);
  await writeClients(clients);
  revalidatePath("/");
}

export async function reseedFromRepo() {
  await resetToShippedSeed();
  revalidatePath("/");
}

export async function setStatus(id: string, status: Status) {
  if (!isStatus(status) || !id) return;
  const clients = await readClients();
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1) return;
  clients[idx] = { ...clients[idx], status };
  await writeClients(clients);
  revalidatePath("/");
}

export async function deleteClient(id: string) {
  if (!id) return;
  const clients = await readClients();
  await writeClients(clients.filter((c) => c.id !== id));
  revalidatePath("/");
}

function parseBulkNames(text: string): string[] {
  const names: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const first = line.includes(",") ? line.split(",")[0].trim() : line;
    if (!first) continue;
    const lower = first.toLowerCase();
    if (lower === "client" || lower === "name" || lower === "business") continue;
    names.push(first);
  }
  return names;
}

export async function bulkAdd(formData: FormData) {
  const names = parseBulkNames(String(formData.get("names") ?? ""));
  if (names.length === 0) return;
  const clients = await readClients();
  const existing = new Set(clients.map((c) => c.client.toLowerCase()));
  const added: Client[] = [];
  for (const name of names) {
    if (existing.has(name.toLowerCase())) continue;
    existing.add(name.toLowerCase());
    added.push({
      ...emptyClient(),
      id: crypto.randomUUID(),
      client: name,
      status: "Potential",
    });
  }
  if (added.length === 0) return;
  await writeClients([...added, ...clients]);
  revalidatePath("/");
}
