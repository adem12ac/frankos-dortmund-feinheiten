// Server-only environment variable access with clear error messages.
// Never import this file from client components.

export function requireEnv(name: string): string {
  // .trim() guards against a stray trailing newline/space that easily sneaks
  // in when pasting values into Vercel's Environment Variables UI — this bit
  // us twice already (ADMIN_PASSWORD, then almost STRIPE_WEBHOOK_SECRET).
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `See SETUP.md for the full list of required variables.`,
    );
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}
