import type { Metadata } from "next";

import { StyledRegistry } from "@/styles/styled-registry";

import "./globals.css";

export const metadata: Metadata = {
  title: "Local Todo (SQLite)",
  description: "MVP scaffold — inner layers live under src/domain, src/application, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledRegistry>{children}</StyledRegistry>
      </body>
    </html>
  );
}
