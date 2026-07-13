import axios from "axios";

/**
 * All network calls the upload modal needs, isolated behind a small
 * service so components never touch axios directly.
 *
 * Swap BASE_URL / endpoint paths for your real backend. Every function
 * accepts an AbortController signal so callers can cancel in-flight work.
 */

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

/**
 * Uploads a File directly to the backend as multipart/form-data.
 * Progress is derived from axios' native onUploadProgress event, which
 * reports real bytes sent over the wire (loaded / total) — no timers,
 * no simulated increments.
 *
 * @param {File} file
 * @param {Object} options
 * @param {(progress: {loaded:number,total:number,percent:number}) => void} options.onProgress
 * @param {AbortSignal} options.signal
 */
export async function uploadFile(file, { onProgress, signal } = {}) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${BASE_URL}/uploads`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    signal,
    onUploadProgress: (event) => {
      if (!onProgress) return;
      const total = event.total ?? file.size;
      const loaded = event.loaded ?? 0;
      onProgress({
        loaded,
        total,
        percent: total ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
      });
    },
  });

  return response.data; // expected: { id, url, fileName, size, ... }
}

/**
 * Kicks off a server-side fetch of a remote file by URL. The backend is
 * expected to respond immediately with a job id, then stream progress
 * back over Server-Sent Events at /uploads/url/:jobId/events. This keeps
 * the browser's reported progress tied to what the backend has actually
 * downloaded/ingested, rather than a client-side guess.
 *
 * @param {string} url
 * @param {Object} options
 * @param {(progress: {loaded:number,total:number,percent:number}) => void} options.onProgress
 * @param {AbortSignal} options.signal
 */
export async function uploadFromUrl(url, { onProgress, signal } = {}) {
  const { data: job } = await axios.post(
    `${BASE_URL}/uploads/url`,
    { url },
    { signal }
  );

  if (!job?.jobId) {
    throw new Error("Upload could not be started for that URL.");
  }

  return new Promise((resolve, reject) => {
    const source = new EventSource(
      `${BASE_URL}/uploads/url/${job.jobId}/events`
    );

    const cleanup = () => source.close();

    if (signal) {
      signal.addEventListener("abort", () => {
        cleanup();
        reject(new DOMException("Upload cancelled", "AbortError"));
      });
    }

    source.addEventListener("progress", (event) => {
      const payload = JSON.parse(event.data);
      onProgress?.({
        loaded: payload.loaded,
        total: payload.total,
        percent: payload.total
          ? Math.min(100, Math.round((payload.loaded / payload.total) * 100))
          : payload.percent ?? 0,
      });
    });

    source.addEventListener("complete", (event) => {
      const payload = JSON.parse(event.data);
      cleanup();
      resolve(payload); // expected: { id, url, fileName, size, ... }
    });

    source.addEventListener("error", (event) => {
      cleanup();
      const message =
        (event && event.data && JSON.parse(event.data)?.message) ||
        "The file at that URL couldn't be uploaded.";
      reject(new Error(message));
    });
  });
}

/**
 * Fallback polling-based progress reader, useful when a backend can't
 * offer SSE/WebSockets but does expose a plain progress endpoint. Not
 * used by default (SSE above is preferred) but kept here so teams can
 * swap it in with a one-line change in useFileUpload.
 */
export async function pollUrlUploadProgress(jobId, { onProgress, signal, intervalMs = 700 } = {}) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");

    const { data } = await axios.get(`${BASE_URL}/uploads/url/${jobId}`, { signal });
    onProgress?.({
      loaded: data.loaded,
      total: data.total,
      percent: data.total
        ? Math.min(100, Math.round((data.loaded / data.total) * 100))
        : data.percent ?? 0,
    });

    if (data.status === "complete") return data.result;
    if (data.status === "failed") throw new Error(data.message || "Upload failed.");

    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
