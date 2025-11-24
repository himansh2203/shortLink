"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";

type Props = { params: { code: string } };

export default function DashboardPage({ params }: Props) {
  const code = String(params?.code ?? "");
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${base.replace(/\/$/, "")}/api/links/${encodeURIComponent(code)}`;

  const [links, setLinks] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json().catch(() => []);
    setLinks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <UrlForm onCreated={load} />
      <hr />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <UrlList links={links ?? []} onDeleted={load} />
      )}
    </div>
  );
}