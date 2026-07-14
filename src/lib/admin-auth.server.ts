// Password-protected admin session using HMAC-SHA256 signed, HttpOnly cookies.
// Uses the Web Crypto API so it runs on both Node (Vercel) and edge runtimes.
import { requireEnv } from "./env.server";

const COOKIE_NAME = "frankos_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

async function getHmacKey(): Promise<CryptoKey> {
  // .trim() guards against a stray trailing newline/space that easily sneaks
  // in when pasting the secret into Vercel's Environment Variables UI.
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(requireEnv("ADMIN_SESSION_SECRET").trim()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Constant-time string comparison to avoid timing attacks on the password. */
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i % aBytes.length] ?? 0) ^ (bBytes[i % bBytes.length] ?? 0);
  }
  return diff === 0;
}

export function verifyAdminPassword(password: string): boolean {
  // Same trailing-whitespace tolerance as the session secret above.
  return timingSafeEqual(password, requireEnv("ADMIN_PASSWORD").trim());
}

/** Creates a signed session token: `<expiresAtMs>.<hmac>`. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(expiresAt));
  return `${expiresAt}.${toBase64Url(signature)}`;
}

async function verifySessionToken(token: string): Promise<boolean> {
  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0) return false;
  const expiresAt = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;
  try {
    const key = await getHmacKey();
    const sigBytes = fromBase64Url(signature);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.slice().buffer,
      encoder.encode(expiresAt),
    );
  } catch {
    return false;
  }
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return false;
  return verifySessionToken(token);
}

/** Returns a 401 Response when unauthenticated, otherwise null. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  if (await isAdminRequest(request)) return null;
  return Response.json({ error: "Nicht autorisiert" }, { status: 401 });
}

export function sessionCookieHeader(token: string, request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookieHeader(request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}
