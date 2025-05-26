"use client"

import { useEffect } from "react"
import { AchievementsList } from "@/features/achievements/achievements-list"
import { useAchievementsStore } from "@/stores/useAchievementsStore"

export default function AchievementsPage() {
  // Récupérer la fonction de chargement des achievements
  const fetchAchievements = useAchievementsStore(state => state.fetchAchievements)
  
  // Charger les achievements au montage du composant
  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <AchievementsList />
    </div>
  )
}
