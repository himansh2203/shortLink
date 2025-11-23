import React from "react";

export default function Header() {
  return (
    <header className="container py-4 flex items-center justify-between">
      <h1 style={{ margin: 0, fontSize: 20 }}>URL Shortener</h1>
      <nav>
        <a href="/" style={{ marginRight: 12 }}>
          Dashboard
        </a>
        <a href="/code/example" style={{ opacity: 0.7 }}>
          Stats
        </a>
      </nav>
    </header>
  );
}