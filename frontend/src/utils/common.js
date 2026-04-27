export function timeAgo(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now - date;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
  if (days < 365) return `${Math.floor(days / 30)} month(s) ago`;

  return `${Math.floor(days / 365)} year(s) ago`;
}
