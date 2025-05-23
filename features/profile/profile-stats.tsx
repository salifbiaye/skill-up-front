import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProfileStats() {
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
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-bold">87</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Heures d'étude</p>
                <p className="text-3xl font-bold">156</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Algorithmique</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Mathématiques</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Anglais</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Programmation Web</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Objectifs complétés</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Heures d'étude</p>
                <p className="text-3xl font-bold">42</p>
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Graphique de progression mensuelle
            </div>
          </TabsContent>
          <TabsContent value="year">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Objectifs complétés</p>
                <p className="text-3xl font-bold">10</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tâches terminées</p>
                <p className="text-3xl font-bold">76</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Heures d'étude</p>
                <p className="text-3xl font-bold">128</p>
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Graphique de progression annuelle
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
