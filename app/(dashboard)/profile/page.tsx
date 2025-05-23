"use client"

import { useEffect } from "react"
import { ProfileHeader } from "@/features/profile/profile-header"
import { ProfileInfo } from "@/features/profile/profile-info"
import { ProfileAchievements } from "@/features/profile/profile-achievements"
import { ProfileSecurity } from "@/features/profile/profile-security"
import { useProfileStore, useObjectivesStore, useTasksStore, useNotesStore, useAiChatStore } from "@/stores"

export default function ProfilePage() {
    // Récupérer les fonctions de chargement des données depuis les stores
    const fetchProfile = useProfileStore(state => state.fetchProfile)
    const fetchObjectives = useObjectivesStore(state => state.fetchObjectives)
    const fetchTasks = useTasksStore(state => state.fetchTasks)
    const fetchNotes = useNotesStore(state => state.fetchNotes)
    const fetchChatSessions = useAiChatStore(state => state.fetchChatSessions)
    
    // Charger les données au montage du composant
    useEffect(() => {
        fetchProfile()
        fetchObjectives()
        fetchTasks()
        fetchNotes()
        fetchChatSessions()
    }, [])
    
    return (
        <div className="flex flex-col gap-8 p-8">
            <ProfileHeader />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <ProfileInfo />
                    <ProfileSecurity />
                </div>
                <div className="md:col-span-2">
                    <ProfileAchievements />
                </div>
            </div>
        </div>
    )
}
