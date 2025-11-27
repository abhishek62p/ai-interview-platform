import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Stable, SSR-safe UTC date formatting to avoid locale/timezone hydration mismatches
const utcDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC'
});

const utcDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: true, timeZone: 'UTC'
});

export function formatDateUTC(date: Date | string | null | undefined) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return utcDateFormatter.format(d); // MM/DD/YYYY (en-US) consistent across server/client
}

export function formatDateTimeUTC(date: Date | string | null | undefined) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return utcDateTimeFormatter.format(d); // MM/DD/YYYY, HH:MM:SS AM/PM UTC stable
}
