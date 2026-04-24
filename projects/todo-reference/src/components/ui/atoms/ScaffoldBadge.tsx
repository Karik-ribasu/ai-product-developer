import styles from "./ScaffoldBadge.module.css";

export function ScaffoldBadge({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>;
}
