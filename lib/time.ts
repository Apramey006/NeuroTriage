export const TPA_WINDOW_MINUTES = 270; // 4.5 hours
export const THROMBECTOMY_WINDOW_MINUTES = 1440; // 24 hours

export function minutesSince(iso: string, now: Date = new Date()): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((now.getTime() - t) / 60000));
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const mins = minutesSince(iso, now);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  const remMin = mins % 60;
  if (hours < 24)
    return remMin === 0 ? `${hours}h ago` : `${hours}h ${remMin}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatMinutes(mins: number): string {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export interface WindowState {
  total: number;
  elapsed: number;
  remaining: number;
  pctElapsed: number; // 0..100
  state: "open" | "closing" | "closed";
}

export function tpaWindow(lkwIso: string, now: Date = new Date()): WindowState {
  return computeWindow(lkwIso, TPA_WINDOW_MINUTES, now);
}

export function thrombectomyWindow(
  lkwIso: string,
  now: Date = new Date()
): WindowState {
  return computeWindow(lkwIso, THROMBECTOMY_WINDOW_MINUTES, now);
}

function computeWindow(
  lkwIso: string,
  totalMin: number,
  now: Date
): WindowState {
  const elapsed = minutesSince(lkwIso, now);
  const remaining = Math.max(0, totalMin - elapsed);
  const pctElapsed = Math.min(100, (elapsed / totalMin) * 100);
  let state: WindowState["state"] = "open";
  if (remaining === 0) state = "closed";
  else if (remaining <= 30) state = "closing";
  return { total: totalMin, elapsed, remaining, pctElapsed, state };
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
