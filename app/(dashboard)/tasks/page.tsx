"use client";

import dynamic from "next/dynamic";

const TasksContent = dynamic(() => import("./tasks-content"), { ssr: false });

export default function TasksPage() {
  return <TasksContent />;
}
