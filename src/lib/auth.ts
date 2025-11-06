/**
 * auth.ts
 * Helpers to store and inspect JSON Web Tokens (JWT) on the client.
 *
 * Notes / security:
 * - We only decode the JWT payload client-side (base64url -> JSON). This
 *   allows the UI to read fields like `exp` (expiry) and show user info.
 * - Client-side decoding does NOT validate the token signature — only the
 *   server can securely validate tokens. Use these helpers for UX (redirect
 *   when token expired) but always enforce auth on the server.
 */
const TOKEN_KEY = "jwt_token";

// Save the raw token string in localStorage under TOKEN_KEY.
// Using localStorage is simple but susceptible to XSS. For production,
// consider httpOnly cookies for refresh/access token flows.
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Read the token string from localStorage. Returns null when missing.
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove the stored token (logout helper)
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Parse the JWT payload (naive).
 * Steps:
 *  - split by '.' and take the middle part (payload)
 *  - base64url decode to string, then JSON.parse
 *
 * Returns parsed payload object or null on error.
 * IMPORTANT: this does NOT verify the JWT signature.
 */
export function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // atob for base64 decode; replace URL-safe chars
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

/**
 * Check whether token is currently valid (not expired).
 * - Accepts token string or reads stored token when omitted.
 * - Handles exp as number or numeric-string and detects seconds vs ms.
 * - Returns true when exp is in the future.
 */
export function isTokenValid(token?: string | null) {
  const t = token ?? getToken();
  if (!t) return false;
  const payload = parseJwt(t);
  if (!payload || payload.exp == null) return false;
  // exp might be a number or a numeric string. Also some tokens use ms instead of seconds.
  let exp = payload.exp;
  if (typeof exp === "string" && /^\d+$/.test(exp)) {
    exp = parseInt(exp, 10); // convert numeric string to number
  }
  if (typeof exp !== "number") return false;

  const nowMs = Date.now(); // current time in milliseconds
  // if exp looks like milliseconds (>= 1e12) treat as ms, otherwise seconds
  if (exp > 1e12) {
    return exp > nowMs;
  }
  const nowSec = Math.floor(nowMs / 1000);
  return exp > nowSec; // seconds comparison
}

export const getAvatar = (): string | null => {
  const token: string | null = getToken();
  const payload: any = parseJwt(token);
  if (payload && payload.avatar) {
    return payload.avatar;
  }
  return null;
};

export default {
  setToken,
  getToken,
  removeToken,
  getAvatar,
  parseJwt,
  isTokenValid,
};
