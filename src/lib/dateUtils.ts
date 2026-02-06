/**
 * Format a timestamp to a relative time string (e.g., "2 hours ago")
 */
export function formatDistanceToNow(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  if (weeks > 0) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (days > 0) {
    return days === 1 ? "Yesterday" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}

/**
 * Format a timestamp to a readable date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a timestamp to a readable date and time string
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format a timestamp to time only
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Check if a date is overdue
 */
export function isOverdue(timestamp: number): boolean {
  return timestamp < Date.now();
}

/**
 * Check if a date is within the next N days
 */
export function isDueWithin(timestamp: number, days: number): boolean {
  const future = Date.now() + days * 24 * 60 * 60 * 1000;
  return timestamp <= future && timestamp >= Date.now();
}

/**
 * Get days until a date (negative if overdue)
 */
export function daysUntil(timestamp: number): number {
  const diff = timestamp - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

/**
 * Format due date with urgency indication
 */
export function formatDueDate(timestamp: number): string {
  const days = daysUntil(timestamp);

  if (days < 0) {
    const overdueDays = Math.abs(days);
    return overdueDays === 1 ? "1 day overdue" : `${overdueDays} days overdue`;
  }
  if (days === 0) {
    return "Due today";
  }
  if (days === 1) {
    return "Due tomorrow";
  }
  if (days <= 7) {
    return `Due in ${days} days`;
  }
  return formatDate(timestamp);
}
