"use client"

import { useEffect } from "react"
import { TasksList } from "@/features/tasks/tasks-list"
import { useTasksStore } from "@/stores"

export default function TasksPage() {
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  
  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks()
  }, [])
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <TasksList />
    </div>
  )
}
