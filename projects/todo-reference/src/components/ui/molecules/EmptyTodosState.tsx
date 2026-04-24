import styles from "./EmptyTodosState.module.css";

export function EmptyTodosState() {
  return (
    <section className={styles.panel} aria-labelledby="empty-todos-title">
      <h2 className={styles.title} id="empty-todos-title">
        No todos yet
      </h2>
      <p className={styles.body}>
        Add your first task using the form above. Your list will show up here once you create
        something to do.
      </p>
    </section>
  );
}
