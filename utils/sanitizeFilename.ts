export function sanitizeFilename(filename) {
  // Replace reserved characters with underscores
  filename = filename.replace(/[\\/:"*?<>|]/g, "_")

  // Replace whitespace with underscores
  filename = filename.replace(/\s/g, "_")

  // Remove trailing dots (Windows doesn't allow them)
  filename = filename.replace(/\.+$/, "")

  // Truncate filename if it's too long (max 255 characters for most filesystems)
  if (filename.length > 255) {
    filename = filename.substring(0, 255)
  }

  return filename
}
