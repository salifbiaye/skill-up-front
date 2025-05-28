"use client"

import { useState } from "react"
import { useAchievementsStore } from "@/stores/useAchievementsStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Clock, Medal, Map, Trophy, Loader2 } from "lucide-react"
import { Achievement } from "@/types/achievement"
import { cn } from "@/lib/utils"

export function AchievementsList() {
  const achievements = useAchievementsStore(state => state.achievements)
  const isLoading = useAchievementsStore(state => state.isLoading)
  const error = useAchievementsStore(state => state.error)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  // Fonction pour obtenir l'icône correspondante
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-6 w-6" />
      case 'award':
        return <Award className="h-6 w-6" />
      case 'medal':
        return <Medal className="h-6 w-6" />
      case 'clock':
        return <Clock className="h-6 w-6" />
      case 'map':
        return <Map className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  }

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }



  return (
    <Card className={"bg-background"}>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription>Suivez votre progression et débloquez des récompenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                achievement.unlocked 
                  ? "bg-primary/5 hover:bg-primary/10" 
                  : "bg-muted/30 hover:bg-muted/50"
              )}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {getIcon(achievement.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="bg-primary/10">Débloqué</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  {achievement.unlocked && achievement.date && (
                    <p className="text-xs text-muted-foreground mb-2">Débloqué le {formatDate(achievement.date)}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
