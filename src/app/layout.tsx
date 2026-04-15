import type { Metadata } from "next";

import { StyledRegistry } from "@/styles/styled-registry";

import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Task Manager",
  description: "MVP primary dashboard — tasks backed by local SQLite; governed design_system tokens.",
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
