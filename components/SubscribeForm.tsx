"use client";

import { useState } from "react";

export default function SubscribeForm({
  programs,
  preselectedId,
  compact = false,
}: {
  programs: { id: number; name: string }[];
  preselectedId?: number;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<number[]>(preselectedId ? [preselectedId] : []);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, program_ids: selected }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(body.error ?? "Something went wrong — try again.");
        return;
      }
      setState("done");
      setMessage(body.message ?? "Check your inbox to confirm your subscription.");
    } catch {
      setState("error");
      setMessage("Network error — try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-4 text-sm text-emerald-800">
        ✓ {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg ring-1 ring-inset ring-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-lg bg-gray-900 text-white px-5 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {state === "sending" ? "Subscribing…" : "Notify me"}
        </button>
      </div>

      {!compact && (
        <details className="text-sm text-gray-600">
          <summary className="cursor-pointer select-none text-gray-500">
            Only specific programs? ({selected.length === 0 ? "currently: all" : `${selected.length} selected`})
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {programs.map((p) => {
              const active = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setSelected((s) => (active ? s.filter((x) => x !== p.id) : [...s, p.id]))
                  }
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    active
                      ? "bg-gray-900 text-white ring-gray-900"
                      : "bg-white text-gray-600 ring-gray-300 hover:ring-gray-500"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </details>
      )}

      {state === "error" && <p className="text-sm text-red-600">{message}</p>}
      <p className="text-xs text-gray-400">
        One email when a window is about to open, opens, or is about to close. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}
