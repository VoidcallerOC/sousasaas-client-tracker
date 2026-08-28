import { get, list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Client } from "./types";

const BLOB_PATHNAME = "clients.json";

function blobTokenKey(): string {
  return ["BLOB", "READ", "WRITE", "TOKEN"].join("_");
}

export function blobEnabled(): boolean {
  return Boolean(process.env[blobTokenKey()]);
}

function localDataPath(): string {
  return path.join(process.cwd(), "data", "clients.json");
}

async function loadShippedSeed(): Promise<Client[]> {
  const filePath = localDataPath();
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Shipped data/clients.json is not an array");
  }
  return parsed as Client[];
}

async function parseClientsJson(text: string): Promise<Client[] | null> {
  if (!text.trim()) return null;
  const parsed = JSON.parse(text) as unknown;
  if (!Array.isArray(parsed)) return null;
  return parsed as Client[];
}

async function readFromBlob(): Promise<Client[] | null> {
  try {
    const result = await get(BLOB_PATHNAME, {
      access: "private",
      useCache: false,
    });
    if (result && result.statusCode === 200 && result.stream) {
      const text = await new Response(result.stream).text();
      return parseClientsJson(text);
    }
  } catch {
    // Store may be public, or blob may not exist yet.
  }

  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 20 });
    const match = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    if (!match) return null;
    const url = match.downloadUrl || match.url;
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return parseClientsJson(text);
  } catch {
    return null;
  }
}

async function writeToBlob(clients: Client[]): Promise<void> {
  const body = JSON.stringify(clients, null, 2);
  const base = {
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  } as const;

  try {
    await put(BLOB_PATHNAME, body, { ...base, access: "private" });
  } catch {
    await put(BLOB_PATHNAME, body, { ...base, access: "public" });
  }
}

export async function readClients(): Promise<Client[]> {
  if (blobEnabled()) {
    const existing = await readFromBlob();
    if (existing && existing.length > 0) return existing;
    const seed = await loadShippedSeed();
    await writeToBlob(seed);
    return seed;
  }

  try {
    const raw = await fs.readFile(localDataPath(), "utf8");
    const parsed = await parseClientsJson(raw);
    if (parsed) return parsed;
  } catch {
    // Fall through to seed + write.
  }

  const seed = await loadShippedSeed();
  await fs.mkdir(path.dirname(localDataPath()), { recursive: true });
  await fs.writeFile(localDataPath(), JSON.stringify(seed, null, 2));
  return seed;
}

export async function writeClients(clients: Client[]): Promise<void> {
  if (blobEnabled()) {
    await writeToBlob(clients);
    return;
  }
  await fs.mkdir(path.dirname(localDataPath()), { recursive: true });
  await fs.writeFile(localDataPath(), JSON.stringify(clients, null, 2));
}
