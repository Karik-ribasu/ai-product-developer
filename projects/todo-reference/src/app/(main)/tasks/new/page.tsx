import { TaskCreationStitchBaseline } from "@/components/baseline/TaskCreationStitchBaseline";

import { TaskComposerClient } from "./TaskComposerClient";

export const dynamic = "force-dynamic";

export default function NewTaskPage() {
  if (process.env.STITCH_BASELINE_UI === "1") {
    return <TaskCreationStitchBaseline />;
  }
  return <TaskComposerClient />;
}
