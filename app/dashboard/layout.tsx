import React from "react";
import "../globals.css";

export const metadata = {
  title: "AI Interview Platform",
  description: "Your personal AI-powered interview coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
