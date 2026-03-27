/**
 * Minimal JWT helper utilities used by the UI:
 * - decodeToken
 * - getTokenExpirationDate
 * - isTokenExpired
 * - getTokenRoles
 * - token storage helpers
 */

export const TOKEN_KEY = 'auth_token';

function urlBase64Decode(str: string): string {
  if (!str) { return '' }
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    // fallback
    try { return atob(str); } catch { return ''; }
  }
}

export function decodeToken(token?: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = parts[1];
  const decoded = urlBase64Decode(payload);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getTokenExpirationDate(token?: string): Date | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  // exp is usually in seconds since epoch
  if (typeof decoded.exp === 'number') {
    return new Date(decoded.exp * 1000);
  }
  return null;
}

export function isTokenExpired(token?: string, offsetSeconds = 0): boolean {
  const exp = getTokenExpirationDate(token);
  if (!exp) return true;
  // treat missing exp as expired
  const now = new Date();
  return (exp.getTime() <= (now.getTime() + offsetSeconds * 1000));
}

export function getTokenRoles(token?: string): string[] {
  const decoded = decodeToken(token);
  if (!decoded) return [];

  // Common claim names for roles: 'role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  const candidates = [
    decoded.role,
    decoded.roles,
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    decoded['roles']
  ];

  for (const c of candidates) {
    if (!c) continue;
    if (Array.isArray(c)) return c.map(String);
    if (typeof c === 'string') return [c];
  }

  return [];
}

// Storage helpers
export function getTokenFromStorage(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function saveTokenToStorage(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { }
}

export function removeTokenFromStorage(): void {
  try { localStorage.removeItem(TOKEN_KEY); } catch { }
}
