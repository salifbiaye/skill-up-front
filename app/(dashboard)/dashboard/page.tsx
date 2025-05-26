"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/features/dashboard/dashboard-header"
import { ObjectivesList } from "@/features/objectives/objectives-list"
import { RecentTasks } from "@/features/tasks/recent-tasks"
import { StatsCards } from "@/features/dashboard/stats-cards"
import { ActivityChart } from "@/features/dashboard/activity-chart"
import { useObjectivesStore, useTasksStore, useNotesStore } from "@/stores"

export default function DashboardPage() {
  // Récupérer les fonctions de chargement des données depuis les stores
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
  const fetchTasks = useTasksStore(state => state.fetchTasks)
  const fetchNotes = useNotesStore(state => state.fetchNotes)
  
  // Charger les données au montage du composant
  useEffect(() => {
    fetchObjectives()
    fetchTasks()
    fetchNotes()
  }, [])
  
  return (
    <div className="w-full flex flex-col gap-8 p-8">
      <DashboardHeader />
      <StatsCards />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ActivityChart />
        <RecentTasks />
      </div>
      <ObjectivesList />
    </div>
  )
}
