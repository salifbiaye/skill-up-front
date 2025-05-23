"use client"

import { useEffect } from "react"
import { ObjectivesHeader } from "@/features/objectives/objectives-header"
import { ObjectivesGrid } from "@/features/objectives/objectives-grid"
import { useObjectivesStore } from "@/stores"

export default function ObjectivesPage() {
  const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
  
  // Charger les objectifs au montage du composant
  useEffect(() => {
    fetchObjectives()
  }, [])
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <ObjectivesGrid />
    </div>
  )
}
