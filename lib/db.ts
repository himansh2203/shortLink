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

async function readLinks(): Promise<Link[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Link[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeLinks(links: Link[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2), "utf8");
}

export async function listLinks(): Promise<Link[]> {
  return readLinks();
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  const links = await readLinks();
  return links.find((l) => l.code === code) ?? null;
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