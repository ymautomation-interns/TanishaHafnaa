/**
 * Central place for upload validation rules. Import ACCEPTED_FILE_TYPES /
 * MAX_FILE_SIZE_BYTES wherever the UI needs to describe or enforce limits,
 * so the displayed copy and the actual validation never drift apart.
 */

export const ACCEPTED_FILE_TYPES = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_FILE_TYPES).flat();

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function getFileExtension(fileName = "") {
  const index = fileName.lastIndexOf(".");
  return index > -1 ? fileName.slice(index).toLowerCase() : "";
}

export function isAcceptedFileType(file) {
  if (!file) return false;
  const ext = getFileExtension(file.name);
  return ACCEPTED_EXTENSIONS.includes(ext);
}

export function isWithinSizeLimit(file, maxBytes = MAX_FILE_SIZE_BYTES) {
  return !!file && file.size <= maxBytes;
}

/**
 * Validates a single File object, returning a human-readable error
 * string, or null when the file passes every check.
 */
export function validateFile(file, { maxBytes = MAX_FILE_SIZE_BYTES } = {}) {
  if (!file) return "No file was selected.";
  if (!isAcceptedFileType(file)) {
    return `"${file.name}" isn't a supported format. Use CSV, XLSX, PDF, DOCX, JPG, or PNG.`;
  }
  if (!isWithinSizeLimit(file, maxBytes)) {
    return `"${file.name}" is too large. Maximum file size is ${(
      maxBytes /
      (1024 * 1024)
    ).toFixed(0)} MB.`;
  }
  return null;
}

/**
 * Loose but effective URL validator: requires http(s) protocol and a host.
 */
export function validateUrl(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return "Enter a file URL to continue.";
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return "That doesn't look like a valid URL.";
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return "URL must start with http:// or https://.";
  }
  if (!parsed.hostname) {
    return "That doesn't look like a valid URL.";
  }
  return null;
}
