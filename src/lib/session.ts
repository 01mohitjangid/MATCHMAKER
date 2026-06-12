import { DEMO_MATCHMAKER } from "@/config/matchmaker";

export const SESSION_COOKIE = "mm_session";

export interface SessionData {
  id: string;
  username: string;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production",
};

const SECRET =
  process.env.SESSION_SECRET ?? "dev-insecure-secret-change-in-production";

const encoder = new TextEncoder();

function strToBuf(s: string): ArrayBuffer {
  const u = encoder.encode(s);
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

function bytesToB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBuf(s: string): ArrayBuffer {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

function importKey(usages: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    strToBuf(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages,
  );
}

export async function signSession(data: SessionData): Promise<string> {
  const payload = bytesToB64Url(encoder.encode(JSON.stringify(data)));
  const key = await importKey(["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, strToBuf(payload));
  return `${payload}.${bytesToB64Url(new Uint8Array(sig))}`;
}

export async function readSession(
  value: string | undefined | null,
): Promise<SessionData | null> {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;

  try {
    const key = await importKey(["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64UrlToBuf(sig),
      strToBuf(payload),
    );
    if (!valid) return null;

    const parsed = JSON.parse(
      new TextDecoder().decode(b64UrlToBuf(payload)),
    ) as Partial<SessionData>;
    if (typeof parsed?.id === "string" && typeof parsed?.username === "string") {
      return { id: parsed.id, username: parsed.username };
    }
    return null;
  } catch {
    return null;
  }
}

/** True when the cookie is a valid signed session for the known matchmaker. */
export async function isValidSession(
  value: string | undefined | null,
): Promise<boolean> {
  const s = await readSession(value);
  return s?.id === DEMO_MATCHMAKER.id && s?.username === DEMO_MATCHMAKER.username;
}
