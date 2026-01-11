/**
 * Format a date string to a localized date string
 * Handles both ISO strings and Date objects
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date string to a localized date and time string
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
}

/**
 * Get a relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(dateObj);
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Invalid date';
  }
}
