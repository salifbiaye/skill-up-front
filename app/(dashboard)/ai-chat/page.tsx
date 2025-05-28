"use client"

import { useEffect } from "react"
import { AiChatInterface } from "@/features/ai-chat/ai-chat-interface"
import { useAiChatStore } from "@/stores"
import {AiChatHeader} from "@/features/ai-chat/ai-chat-header";
import {DashboardHeader} from "@/features/dashboard/dashboard-header";
import {StatsCards} from "@/features/dashboard/stats-cards";
import {ActivityChart} from "@/features/dashboard/activity-chart";
import {RecentTasks} from "@/features/tasks/recent-tasks";
import {ObjectivesList} from "@/features/objectives/objectives-list";

export default function AiChatPage() {
  const fetchChatSessions = useAiChatStore(state => state.fetchChatSessions)
  
  // Charger les sessions de chat au montage du composant
  useEffect(() => {
    fetchChatSessions()
  }, [])
  
  return (
        <AiChatInterface/>
)
}
