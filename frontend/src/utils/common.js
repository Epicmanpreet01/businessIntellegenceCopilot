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

export function parse_frequency(freq) {
  if (freq == "D") return "Daily";
  else if (freq == "W") return "Weekly";
  else if (freq == "M") return "Monthly";
  else return "Yearly";
}

export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return "0 B";
  }

  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 2)} ${units[index]}`;
}

export function formatModelText(text) {
  if (typeof text !== "string") return text;
  // Rounds numbers with 3 or more decimal places to 2 decimal places
  return text.replace(/\d+\.\d{3,}/g, (match) => {
    return parseFloat(match).toFixed(2);
  });
}

export function normalizeText(text) {
  if (typeof text !== "string") return text;
  return text.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}
