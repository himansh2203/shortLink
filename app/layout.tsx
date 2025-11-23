import './globals.css';
import React from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'URL Shortener',
  description: 'Simple URL shortener dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Header />
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  );
}