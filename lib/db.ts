import fs from "fs/promises";
import path from "path";

export type Link = {
  code: string;
  url: string;
  createdAt: string;
  clicks: number;
  lastClicked?: string | null;
};

const DATA_FILE = path.join(process.cwd(), "data", "links.json");

// in-memory fallback store (used when file writes are not allowed)
const inMemory = new Map<string, Link>();
let persistenceAvailable = true;

async function readLinks(): Promise<Link[]> {
  if (!persistenceAvailable) {
    return Array.from(inMemory.values());
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const arr = JSON.parse(raw) as Link[];
    // populate in-memory cache for fast access
    inMemory.clear();
    for (const l of arr) inMemory.set(l.code, l);
    return arr;
  } catch (e: any) {
    // if file not found or permission error, fallback to memory
    if (e.code === "ENOENT") {
      return Array.from(inMemory.values());
    }
    // permission or other errors -> disable persistence and fallback
    console.error("readLinks error, disabling persistence:", e);
    persistenceAvailable = false;
    return Array.from(inMemory.values());
  }
}

async function writeLinks(links: Link[]) {
  if (!persistenceAvailable) {
    // update memory only
    inMemory.clear();
    for (const l of links) inMemory.set(l.code, l);
    return;
  }

  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2), "utf8");
    // keep in-memory cache in sync
    inMemory.clear();
    for (const l of links) inMemory.set(l.code, l);
  } catch (e) {
    console.error("writeLinks failed, disabling persistence and using in-memory:", e);
    persistenceAvailable = false;
    // fallback to memory
    inMemory.clear();
    for (const l of links) in inMemory.set(l.code, l) {}
  }
}

export async function listLinks(): Promise<Link[]> {
  return readLinks();
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  // quick memory check first
  const cached = inMemory.get(code);
  if (cached) return cached;
  const links = await readLinks();
  const found = links.find((l) => l.code === code) ?? null;
  if (found) inMemory.set(found.code, found);
  return found;
}

export async function getStatsByCode(code: string): Promise<{ clicks: number; lastClicked?: string | null } | null> {
  const link = await getLinkByCode(code);
  if (!link) return null;
  return { clicks: link.clicks, lastClicked: link.lastClicked ?? null };
}

export async function createLink(code: string, url: string): Promise<Link> {
  const links = await readLinks();
  if (links.find((l) => l.code === code)) {
    const err: any = new Error("Code exists");
    err.code = "EXISTS";
    throw err;
  }
  const now = new Date().toISOString();
  const link: Link = { code, url, createdAt: now, clicks: 0, lastClicked: null };
  links.push(link);
  await writeLinks(links);
  return link;
}

export async function deleteLink(code: string): Promise<boolean> {
  const links = await readLinks();
  const filtered = links.filter((l) => l.code !== code);
  if (filtered.length === links.length) return false;
  await writeLinks(filtered);
  return true;
}

export async function incrementClick(code: string): Promise<void> {
  const links = await readLinks();
  const i = links.findIndex((l) => l.code === code);
  if (i === -1) return;
  links[i].clicks = (links[i].clicks || 0) + 1;
  links[i].lastClicked = new Date().toISOString();
  await writeLinks(links);
}
