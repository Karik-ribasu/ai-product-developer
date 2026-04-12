import { TodoWorkspace } from "@/components/ui/organisms/todo-workspace";

/**
 * List fetch runs in the client organism so `next build` (Node) does not execute
 * the Bun-only SQLite stack during static page data collection.
 */
export default function Home() {
  return (
    <main>
      <TodoWorkspace />
    </main>
  );
}
