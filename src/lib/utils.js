export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso, opts = { month: "short", year: "numeric" }) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function formatStars(n) {
  if (n == null) return null;
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
