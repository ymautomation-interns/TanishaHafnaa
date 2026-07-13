import { useCallback, useRef, useState } from "react";
import { uploadFile, uploadFromUrl } from "../api/uploadService";
import { validateFile, validateUrl } from "../utils/validators";
import { estimateRemainingSeconds } from "../utils/formatters";

/**
 * STATUS values drive every visual state in the modal:
 * idle -> uploading -> success
 *                   -> error
 */
export const STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
};

const SPEED_SAMPLE_WINDOW_MS = 1200;

export function useFileUpload({ maxBytes } = {}) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [source, setSource] = useState(null); // "file" | "url"
  const [fileMeta, setFileMeta] = useState(null); // { name, size }
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percent: 0 });
  const [speedBps, setSpeedBps] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [result, setResult] = useState(null);

  const abortControllerRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const lastSampleRef = useRef({ time: null, loaded: 0 });
  const pendingRetryRef = useRef(null); // remembers last (file|url) for retry

  const clearElapsedTimer = () => {
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  };

  const resetState = useCallback(() => {
    clearElapsedTimer();
    abortControllerRef.current = null;
    startTimeRef.current = null;
    lastSampleRef.current = { time: null, loaded: 0 };
    setStatus(STATUS.IDLE);
    setSource(null);
    setFileMeta(null);
    setProgress({ loaded: 0, total: 0, percent: 0 });
    setSpeedBps(null);
    setElapsedSeconds(0);
    setRemainingSeconds(null);
    setErrorMessage(null);
    setResult(null);
    pendingRetryRef.current = null;
  }, []);

  const handleProgress = useCallback((event) => {
    const now = performance.now();

    if (startTimeRef.current) {
      setElapsedSeconds((now - startTimeRef.current) / 1000);
    }

    // Compute instantaneous speed from the most recent sample window so
    // it reflects real network conditions instead of a cumulative average.
    const last = lastSampleRef.current;
    if (last.time !== null) {
      const dt = now - last.time;
      if (dt >= SPEED_SAMPLE_WINDOW_MS) {
        const bytesDelta = event.loaded - last.loaded;
        const bps = bytesDelta / (dt / 1000);
        setSpeedBps(bps > 0 ? bps : null);
        setRemainingSeconds(
          estimateRemainingSeconds({
            loaded: event.loaded,
            total: event.total,
            bytesPerSecond: bps > 0 ? bps : null,
          })
        );
        lastSampleRef.current = { time: now, loaded: event.loaded };
      }
    } else {
      lastSampleRef.current = { time: now, loaded: event.loaded };
    }

    setProgress({
      loaded: event.loaded,
      total: event.total,
      percent: event.percent,
    });
  }, []);

  const beginTracking = useCallback(() => {
    startTimeRef.current = performance.now();
    lastSampleRef.current = { time: null, loaded: 0 };
    clearElapsedTimer();
    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds((performance.now() - startTimeRef.current) / 1000);
    }, 500);
  }, []);

  const startFileUpload = useCallback(
    async (file) => {
      const validationError = validateFile(file, { maxBytes });
      if (validationError) {
        setStatus(STATUS.ERROR);
        setErrorMessage(validationError);
        return;
      }

      pendingRetryRef.current = { type: "file", payload: file };
      setSource("file");
      setFileMeta({ name: file.name, size: file.size });
      setErrorMessage(null);
      setResult(null);
      setProgress({ loaded: 0, total: file.size, percent: 0 });
      setStatus(STATUS.UPLOADING);

      const controller = new AbortController();
      abortControllerRef.current = controller;
      beginTracking();

      try {
        const data = await uploadFile(file, {
          onProgress: handleProgress,
          signal: controller.signal,
        });
        clearElapsedTimer();
        setResult(data);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        clearElapsedTimer();
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          setStatus(STATUS.IDLE);
          return;
        }
        setStatus(STATUS.ERROR);
        setErrorMessage(
          err?.response?.data?.message || err?.message || "Upload failed. Please try again."
        );
      }
    },
    [beginTracking, handleProgress, maxBytes]
  );

  const startUrlUpload = useCallback(
    async (url) => {
      const validationError = validateUrl(url);
      if (validationError) {
        setStatus(STATUS.ERROR);
        setErrorMessage(validationError);
        return;
      }

      pendingRetryRef.current = { type: "url", payload: url };
      setSource("url");
      const guessedName = url.split("/").filter(Boolean).pop() || "Remote file";
      setFileMeta({ name: guessedName, size: 0 });
      setErrorMessage(null);
      setResult(null);
      setProgress({ loaded: 0, total: 0, percent: 0 });
      setStatus(STATUS.UPLOADING);

      const controller = new AbortController();
      abortControllerRef.current = controller;
      beginTracking();

      try {
        const data = await uploadFromUrl(url, {
          onProgress: (event) => {
            // Backend may not know total size until headers arrive.
            if (event.total) {
              setFileMeta((prev) => ({ ...prev, size: event.total }));
            }
            handleProgress(event);
          },
          signal: controller.signal,
        });
        clearElapsedTimer();
        setResult(data);
        if (data?.fileName) {
          setFileMeta((prev) => ({ ...prev, name: data.fileName, size: data.size ?? prev.size }));
        }
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        clearElapsedTimer();
        if (err?.name === "AbortError") {
          setStatus(STATUS.IDLE);
          return;
        }
        setStatus(STATUS.ERROR);
        setErrorMessage(err?.message || "Couldn't upload the file from that URL.");
      }
    },
    [beginTracking, handleProgress]
  );

  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort();
    clearElapsedTimer();
    resetState();
  }, [resetState]);

  const removeFile = useCallback(() => {
    resetState();
  }, [resetState]);

  const retryUpload = useCallback(() => {
    const pending = pendingRetryRef.current;
    if (!pending) return;
    if (pending.type === "file") startFileUpload(pending.payload);
    else startUrlUpload(pending.payload);
  }, [startFileUpload, startUrlUpload]);

  return {
    status,
    source,
    fileMeta,
    progress,
    speedBps,
    elapsedSeconds,
    remainingSeconds,
    errorMessage,
    result,
    startFileUpload,
    startUrlUpload,
    cancelUpload,
    removeFile,
    retryUpload,
    isComplete: status === STATUS.SUCCESS,
  };
}
