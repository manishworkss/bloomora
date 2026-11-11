const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 8;

export const ADMIN_COOKIE_NAME = 'bloomora_admin_auth';
export const LEGACY_ADMIN_COOKIE_NAME = 'thc_admin_auth';

export interface AdminSessionPayload {
  sub: string;
  role: 'admin';
  iat: number;
  exp: number;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const loginAttempts = new Map<string, number[]>();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(input: string): Uint8Array | null {
  try {
    const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function getSigningSecretRaw(): string | null {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_CREDENTIAL_PASSWORD;
  if (!secret || secret.trim().length < 8) {
    return null;
  }
  return `bloomora-admin-session-v1:${secret.trim()}`;
}

async function importHmacKey(secretRaw: string): Promise<CryptoKey> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(secretRaw));
  return globalThis.crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function signAdminSessionToken(
  email: string,
  secretOverride?: string,
  nowMs: number = Date.now()
): Promise<string | null> {
  const secretRaw = secretOverride ? `bloomora-admin-session-v1:${secretOverride}` : getSigningSecretRaw();
  if (!secretRaw) return null;

  const payload: AdminSessionPayload = {
    sub: email.trim().toLowerCase(),
    role: 'admin',
    iat: nowMs,
    exp: nowMs + SESSION_TTL_MS,
  };

  const payloadB64 = bytesToBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secretRaw);
  const sigBuf = await globalThis.crypto.subtle.sign('HMAC', key, textEncoder.encode(payloadB64));
  const sigB64 = bytesToBase64Url(new Uint8Array(sigBuf));
  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
  secretOverride?: string,
  nowMs: number = Date.now()
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  const secretRaw = secretOverride ? `bloomora-admin-session-v1:${secretOverride}` : getSigningSecretRaw();
  if (!secretRaw) return null;

  const sigBytes = base64UrlToBytes(sigB64);
  const payloadBytes = base64UrlToBytes(payloadB64);
  if (!sigBytes || !payloadBytes) return null;

  const key = await importHmacKey(secretRaw);
  const expectedSigBuf = await globalThis.crypto.subtle.sign('HMAC', key, textEncoder.encode(payloadB64));
  const expectedSigBytes = new Uint8Array(expectedSigBuf);

  if (!timingSafeEqualBytes(sigBytes, expectedSigBytes)) {
    return null;
  }

  try {
    const parsed = JSON.parse(textDecoder.decode(payloadBytes)) as Partial<AdminSessionPayload>;
    if (
      parsed.role !== 'admin' ||
      typeof parsed.sub !== 'string' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= nowMs
    ) {
      return null;
    }
    return parsed as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const configuredEmail = (
    process.env.ADMIN_CREDENTIAL_EMAIL ||
    process.env.ADMIN_INITIAL_EMAIL ||
    ''
  )
    .trim()
    .toLowerCase();
  const configuredPassword = process.env.ADMIN_CREDENTIAL_PASSWORD || '';

  if (!configuredEmail || !configuredPassword) {
    return false;
  }

  const submittedEmail = email.trim().toLowerCase();
  // Hash both sides with SHA-256 before constant-time comparison so lengths never leak
  const [emailA, emailB, passA, passB] = await Promise.all([
    globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(submittedEmail)),
    globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(configuredEmail)),
    globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(password)),
    globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(configuredPassword)),
  ]);

  const emailOk = timingSafeEqualBytes(new Uint8Array(emailA), new Uint8Array(emailB));
  const passOk = timingSafeEqualBytes(new Uint8Array(passA), new Uint8Array(passB));
  return emailOk && passOk;
}

export function extractCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(pair.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export async function getAdminSessionFromRequest(request: Request): Promise<AdminSessionPayload | null> {
  const cookieHeader = request.headers.get('cookie');
  const token =
    extractCookieValue(cookieHeader, ADMIN_COOKIE_NAME) ||
    extractCookieValue(cookieHeader, LEGACY_ADMIN_COOKIE_NAME);
  return verifyAdminSessionToken(token);
}

export function checkLoginRateLimit(
  clientKey: string,
  nowMs: number = Date.now()
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;
  const existing = (loginAttempts.get(clientKey) || []).filter((ts) => ts > windowStart);

  if (existing.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    loginAttempts.set(clientKey, existing);
    const oldest = existing[0] ?? nowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - nowMs) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.push(nowMs);
  loginAttempts.set(clientKey, existing);

  // Opportunistic map cleanup to prevent unbounded growth in long-running processes
  if (loginAttempts.size > 500) {
    for (const [k, stamps] of loginAttempts.entries()) {
      const active = stamps.filter((ts) => ts > windowStart);
      if (active.length === 0) loginAttempts.delete(k);
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_ATTEMPTS - existing.length),
    retryAfterSeconds: 0,
  };
}

export function clearLoginRateLimit(clientKey: string): void {
  loginAttempts.delete(clientKey);
}

