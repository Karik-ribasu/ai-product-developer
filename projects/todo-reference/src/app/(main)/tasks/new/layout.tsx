import styles from "./segment.module.css";

export const dynamic = "force-dynamic";

export default function TaskCreationSegmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.STITCH_BASELINE_UI === "1") {
    return <>{children}</>;
  }
  return <div className={styles.segment}>{children}</div>;
}
