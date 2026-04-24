import { CuratorChrome } from "@/components/shell/CuratorChrome";

export const dynamic = "force-dynamic";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.STITCH_BASELINE_UI === "1") {
    return <>{children}</>;
  }
  return <CuratorChrome>{children}</CuratorChrome>;
}
