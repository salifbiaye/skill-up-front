"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { ProfileService } from "@/services/profile-service"

// Interface pour les statistiques de l'utilisateur
interface UserStats {
  totalObjectives: number;
  completedObjectives: number;
  inProgressObjectives: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalNotes: number;
  notesWithAiSummary: number;
  joinedDays: number;
  lastUpdated: string;
}

export function ProfileStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await ProfileService.getUserStats();
        setStats(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les statistiques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'apprentissage</CardTitle>
          <CardDescription>Votre progression et vos performances</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'apprentissage</CardTitle>
          <CardDescription>Votre progression et vos performances</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">{error || "Aucune statistique disponible"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques d'apprentissage</CardTitle>
        <CardDescription>Votre progression et vos performances</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
            <TabsTrigger value="year">Cette année</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Objectifs complétés</p>
                <p className="text-3xl font-bold">{stats.completedObjectives}</p>
                <p className="text-xs text-muted-foreground mt-2">{Math.round((stats.completedObjectives / (stats.totalObjectives || 1)) * 100)}% du total</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
                <p className="text-xs text-muted-foreground mt-2">{Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}% du total</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Jours d'activité</p>
                <p className="text-3xl font-bold">{stats.joinedDays}</p>
                <p className="text-xs text-muted-foreground mt-2">Depuis votre inscription</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Objectifs en cours</span>
                  <span className="text-sm font-medium">{stats.inProgressObjectives} / {stats.totalObjectives}</span>
                </div>
                <Progress 
                  value={stats.totalObjectives ? (stats.inProgressObjectives / stats.totalObjectives) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tâches en cours</span>
                  <span className="text-sm font-medium">{stats.inProgressTasks} / {stats.totalTasks}</span>
                </div>
                <Progress 
                  value={stats.totalTasks ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tâches en retard</span>
                  <span className="text-sm font-medium">{stats.overdueTasks} / {stats.totalTasks}</span>
                </div>
                <Progress 
                  value={stats.totalTasks ? (stats.overdueTasks / stats.totalTasks) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Notes avec IA</span>
                  <span className="text-sm font-medium">{stats.notesWithAiSummary} / {stats.totalNotes}</span>
                </div>
                <Progress 
                  value={stats.totalNotes ? (stats.notesWithAiSummary / stats.totalNotes) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Objectifs en cours</p>
                <p className="text-3xl font-bold">{stats.inProgressObjectives}</p>
                <p className="text-xs text-muted-foreground mt-2">Ce mois-ci</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches en retard</p>
                <p className="text-3xl font-bold">{stats.overdueTasks}</p>
                <p className="text-xs text-muted-foreground mt-2">À rattraper</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Taux de complétion</p>
                <p className="text-3xl font-bold">
                  {stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">Des tâches</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="text-sm font-medium mb-3">Progression des objectifs</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Non commencés</span>
                    <span>{stats.totalObjectives - stats.completedObjectives - stats.inProgressObjectives}</span>
                  </div>
                  <Progress 
                    value={stats.totalObjectives ? ((stats.totalObjectives - stats.completedObjectives - stats.inProgressObjectives) / stats.totalObjectives) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>En cours</span>
                    <span>{stats.inProgressObjectives}</span>
                  </div>
                  <Progress 
                    value={stats.totalObjectives ? (stats.inProgressObjectives / stats.totalObjectives) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Terminés</span>
                    <span>{stats.completedObjectives}</span>
                  </div>
                  <Progress 
                    value={stats.totalObjectives ? (stats.completedObjectives / stats.totalObjectives) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Objectifs complétés</p>
                <p className="text-3xl font-bold">{stats.completedObjectives}</p>
                <p className="text-xs text-muted-foreground mt-2">Sur {stats.totalObjectives} au total</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-bold">{stats.completedTasks}</p>
                <p className="text-xs text-muted-foreground mt-2">Sur {stats.totalTasks} au total</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Notes créées</p>
                <p className="text-3xl font-bold">{stats.totalNotes}</p>
                <p className="text-xs text-muted-foreground mt-2">Dont {stats.notesWithAiSummary} avec IA</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="text-sm font-medium mb-3">Répartition des tâches</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Terminées</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
                  <p className="text-xs text-muted-foreground">En cours</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{stats.overdueTasks}</p>
                  <p className="text-xs text-muted-foreground">En retard</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
