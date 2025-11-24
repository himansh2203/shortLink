'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStatsByCode } from "@/lib/db";

type Props = { params: { id: string } };

export default function StatsPage({ params }: Props) {
  const router = useRouter();
  const code = String(params?.id ?? "");
  const [stats, setStats] = useState<{ clicks: number; lastClicked?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/stats/${encodeURIComponent(code)}`);
        if (!mounted) return;
        if (!res.ok) {
          setStats(null);
        } else {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [code]);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard — {code}</h2>
        <div>
          <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/${code}`); }} style={{ marginRight: 8 }}>Copy</button>
          <button onClick={() => router.push("/")}>Back</button>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#fff" }}>
        {loading ? (
          <div>Loading…</div>
        ) : stats ? (
          <div>
            <div><strong>Clicks:</strong> {stats.clicks}</div>
            <div><strong>Last clicked:</strong> {stats.lastClicked ? new Date(stats.lastClicked).toLocaleString() : "—"}</div>
            <div style={{ marginTop: 12 }}>
              <a href={`/${code}`} target="_blank" rel="noreferrer">Open short URL</a>
            </div>
          </div>
        ) : (
          <div>Link not found.</div>
        )}
      </div>
    </div>
  );
}