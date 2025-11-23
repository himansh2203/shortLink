"use client";
import React, { useEffect, useState } from "react";

type Item = { code: string; url: string; clicks: number; lastClicked?: string | null };

export default function UrlList({
  links,
  onDeleted,
}: {
  links?: Item[] | null;
  onDeleted?: (code: string) => Promise<void> | void;
}) {
  const [items, setItems] = useState<Item[]>(links ?? []);

  useEffect(() => {
    setItems(links ?? []);
  }, [links]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete short code "${code}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Delete failed");
        return;
      }

      // If parent provided a refresh callback, call it so parent reloads fresh data.
      if (onDeleted) {
        await onDeleted(code);
      } else {
        // Otherwise update local UI state
        setItems((prev) => prev.filter((i) => i.code !== code));
      }
    } catch {
      alert("Network error");
    }
  };

  if (!items.length) {
    return <div className="p-4 text-sm text-gray-600">No links yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y">
        <thead>
          <tr>
            <th className="text-left px-3 py-2">Code</th>
            <th className="text-left px-3 py-2">Target URL</th>
            <th className="text-left px-3 py-2">Clicks</th>
            <th className="text-left px-3 py-2">Last clicked</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((l) => (
            <tr key={l.code} className="border-t">
              <td className="px-3 py-2 font-mono text-sm">
                <a href={`/${l.code}`} className="text-blue-600 hover:underline">
                  {l.code}
                </a>
              </td>
              <td className="px-3 py-2 max-w-xl">
                <a href={l.url} target="_blank" rel="noreferrer" className="block text-sm text-gray-700 hover:underline" title={l.url}>
                  {l.url}
                </a>
              </td>
              <td className="px-3 py-2">{l.clicks}</td>
              <td className="px-3 py-2 text-sm text-gray-500">{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "—"}</td>
              <td className="px-3 py-2 space-x-2">
                <button onClick={() => handleCopy(l.code)} className="px-2 py-1 border rounded text-sm">
                  Copy
                </button>
                <button onClick={() => handleDelete(l.code)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}