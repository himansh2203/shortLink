import { createLink, getLinkByCode } from "./db";

const CODE_RE = /^[A-Za-z0-9_-]{4,12}$/;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function genCode(len = 6) {
  let s = "";
  for (let i = 0; i < len; i++) s += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  return s;
}

export async function createShortenedUrl(originalUrl: string, customCode?: string) {
  // validate url
  try {
    const u = new URL(originalUrl);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error("Invalid protocol");
  } catch {
    const err: any = new Error("Invalid URL");
    err.code = "INVALID_URL";
    throw err;
  }

  if (customCode) {
    if (!CODE_RE.test(customCode)) {
      const err: any = new Error("Invalid code format");
      err.code = "INVALID_CODE";
      throw err;
    }
    const exists = await getLinkByCode(customCode);
    if (exists) {
      const err: any = new Error("Code exists");
      err.code = "EXISTS";
      throw err;
    }
    const created = await createLink(customCode, originalUrl);
    return created;
  }

  // generate unique
  for (let attempts = 0; attempts < 6; attempts++) {
    const candidate = genCode(6);
    const exists = await getLinkByCode(candidate);
    if (!exists) return await createLink(candidate, originalUrl);
  }
  // fallback longer code
  const fallback = genCode(8);
  return await createLink(fallback, originalUrl);
}