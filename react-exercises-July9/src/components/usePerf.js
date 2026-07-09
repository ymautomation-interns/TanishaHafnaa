import { useRef, useEffect, useState } from "react";

/**
 * Tracks how many times a component has rendered, and how long
 * it took from mount to first paint. Purely a teaching aid —
 * this is the same technique you'd reach for with the React DevTools
 * Profiler, just inlined so the numbers show up in the UI itself.
 */
export function usePerf() {
  const renders = useRef(0);
  renders.current += 1;

  const [paintMs, setPaintMs] = useState(null);

  useEffect(() => {
    const start = performance.now();
    const raf = requestAnimationFrame(() => setPaintMs(performance.now() - start));
    return () => cancelAnimationFrame(raf);
  }, []);

  return { renders: renders.current, paintMs };
}
