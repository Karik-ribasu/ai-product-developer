export function getInternalAppOrigin(): string {
  return process.env.INTERNAL_APP_ORIGIN ?? "http://127.0.0.1:3000";
}
