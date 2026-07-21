import React, { useEffect, useState } from 'react';

function Toast({ notif, onDone }) {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Trigger the slide-in on the next frame so the transition runs.
    const raf = requestAnimationFrame(() => setEntered(true));

    // After 5s, slide back out, then let the parent drop it —
    // by then it's already sitting in the notifications list/bell.
    const leaveTimer = setTimeout(() => setLeaving(true), 5000);
    const removeTimer = setTimeout(() => onDone(notif.id), 5350);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, [notif.id, onDone]);

  return (
    <div className={`toast toast--${notif.type} ${entered && !leaving ? 'toast--in' : ''}`}>
      <div className="toast__title">{notif.title}</div>
      <div className="toast__msg">{notif.message}</div>
    </div>
  );
}

export default function ToastStack({ toasts, onDone }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-layer">
      {toasts.map((t) => (
        <Toast key={t.id} notif={t} onDone={onDone} />
      ))}
    </div>
  );
}
