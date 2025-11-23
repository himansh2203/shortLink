"use client";
import React, { useState } from "react";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
const URL_REGEX = /^(https?:\/\/).+/i;

export default function UrlForm({ onCreated }: { onCreated?: () => void }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!URL_REGEX.test(url)) {
      setError("Invalid URL. Include http:// or https://");
      return;
    }
    if (code && !CODE_REGEX.test(code)) {
      setError("Custom code must be 6-8 alphanumeric characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });
      if (res.status === 409) {
        setError("Code already exists.");
      } else if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d?.error || "Create failed");
      } else {
        const data = await res.json();
        setSuccess(data.shortUrl);
        setUrl("");
        setCode("");
        if (onCreated) onCreated();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 max-w-xl">
      <div>
        <label>Long URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
          disabled={loading}
        />
      </div>
      <div>
        <label>Custom code (optional)</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6-8 letters/numbers"
          disabled={loading}
        />
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {success && (
        <div style={{ color: "green" }}>
          Created:{" "}
          <a href={success} target="_blank" rel="noopener noreferrer">
            {success}
          </a>
        </div>
      )}
    </form>
  );
}