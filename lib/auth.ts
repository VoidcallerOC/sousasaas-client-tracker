export const SESSION_COOKIE = "ss_session";

function authPassword(): string {
  const key = ["AUTH", "PASSWORD"].join("_");
  return process.env[key] || "change-me";
}

export async function sessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:sousasaas-tracker-v1`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export function expectedPassword(): string {
  return authPassword();
}

export async function expectedSessionToken(): Promise<string> {
  return sessionToken(authPassword());
}

export async function isValidSession(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await expectedSessionToken();
  if (cookieValue.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
