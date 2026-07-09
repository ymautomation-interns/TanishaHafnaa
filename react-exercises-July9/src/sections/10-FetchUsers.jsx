import { useState, useEffect } from "react";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";

export default function FetchUsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [reloadKey]);

  return (
    <Panel
      eyebrow="10 / DATA FETCHING"
      title="Fetch Users"
      description="Fetches from JSONPlaceholder inside useEffect, with loading and error states."
      note="AbortController cancels the in-flight request on unmount or reload — no setState-after-unmount warnings."
    >
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => setReloadKey((k) => k + 1)}>
            Reload
          </Button>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 size={13} className="animate-spin" /> Loading users...
            </span>
          )}
        </div>
        {error && (
          <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={15} /> {error}
          </p>
        )}
        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2">
            {users.slice(0, 6).map((u) => (
              <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                <p className="text-xs text-slate-500">@{u.username}</p>
                <p className="mt-1 text-xs text-slate-400">{u.email}</p>
                <p className="text-xs text-slate-400">{u.company?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
