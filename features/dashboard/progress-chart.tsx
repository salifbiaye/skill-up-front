"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression des objectifs</CardTitle>
        <CardDescription>Suivez votre progression sur vos objectifs principaux</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week">
          <TabsList className="mb-4">
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
            <TabsTrigger value="year">Année</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="space-y-4">
            <div className="h-[200px] flex flex-col justify-end space-y-2">
              <div className="flex items-center">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Algorithmique</span>
                    <span className="text-sm font-bold">75%</span>
                  </div>
                  <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mathématiques</span>
                    <span className="text-sm font-bold">50%</span>
                  </div>
                  <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-primary" style={{ width: "50%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anglais</span>
                    <span className="text-sm font-bold">25%</span>
                  </div>
                  <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="month" className="h-[200px] flex items-center justify-center text-muted-foreground">
            Données du mois non disponibles
          </TabsContent>
          <TabsContent value="year" className="h-[200px] flex items-center justify-center text-muted-foreground">
            Données de l'année non disponibles
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
