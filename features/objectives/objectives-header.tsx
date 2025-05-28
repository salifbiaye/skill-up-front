"use client"

import { Button } from "@/components/ui/button"
import { Target, Plus, Zap } from "lucide-react"
import type React from "react";

interface ObjectivesHeaderProps {
    handleOpenCreateModal: () => void
}

export function ObjectivesHeader({ handleOpenCreateModal }: ObjectivesHeaderProps) {
    return (
        <div
            className="relative overflow-hidden  rounded-lg  bg-blue-100 dark:bg-slate-900 p-6  text-blue-800 dark:text-white">
            <div className="absolute inset-0 dark:bg-black/30"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-blue-800/20 dark:bg-white/10 blur-xl"></div>
            <div
                className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-blue-800/20 dark:bg-white/10 blur-lg"></div>


            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Target className="h-8 w-8 animate-spin text-white" style={{animationDuration: "3s"}}/>
                        <div
                            className="absolute inset-0 h-8 w-8 rounded-full border-2 border-white/30 animate-ping"></div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            Objectifs
                            <Zap className="h-6 w-6 animate-bounce text-blue-800 dark:text-yellow-300"/>
                        </h2>
                        <p className="text-white dark:text-emerald-100">Définissez et atteignez vos objectifs</p>
                    </div>
                </div>

                <Button
                    onClick={handleOpenCreateModal}>
                    <Plus className="mr-2 h-4 w-4 animate-pulse"/>
                    Nouvel objectif
                </Button>
            </div>
        </div>
    )
}
