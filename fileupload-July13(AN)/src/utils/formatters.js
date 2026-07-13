/**
 * Formatting helpers used across the upload experience.
 * Kept pure and dependency-free so they're trivially testable.
 */

export function formatBytes(bytes, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : decimals)} ${units[exponent]}`;
}

export function formatSpeed(bytesPerSecond) {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) return null;
  return `${formatBytes(bytesPerSecond)}/s`;
}

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0s";
  const seconds = Math.round(totalSeconds);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${remMinutes}m`;
}

/**
 * Estimates remaining time from a byte-based progress snapshot.
 * Returns seconds, or null when there isn't enough signal yet.
 */
export function estimateRemainingSeconds({ loaded, total, bytesPerSecond }) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return null;
  if (!total || total <= 0) return null;
  const remainingBytes = Math.max(total - loaded, 0);
  return remainingBytes / bytesPerSecond;
}

export function truncateFileName(name, maxLength = 32) {
  if (!name || name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  const ext = extIndex > -1 ? name.slice(extIndex) : "";
  const base = extIndex > -1 ? name.slice(0, extIndex) : name;
  const keep = Math.max(maxLength - ext.length - 1, 4);
  return `${base.slice(0, keep)}…${ext}`;
}
