/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Format name string to a valid value
 */
export function cleanName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
}