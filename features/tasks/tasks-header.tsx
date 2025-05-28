"use client"

import { Button } from "@/components/ui/button"
import { CheckSquare, Plus, Clock, Zap } from "lucide-react"
import React from "react";

interface TasksHeaderProps {
    handleOpenCreateModal: () => void
}

export function TasksHeader({ handleOpenCreateModal }: TasksHeaderProps) {
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
                        <CheckSquare className="h-8 w-8 animate-bounce text-white"/>
                        <Clock className="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse text-green-300"/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            Tâches
                            <Zap className="h-6 w-6 animate-pulse text-blue-800 dark:text-yellow-300"/>
                        </h2>
                        <p className="text-blue-800 dark:text-cyan-100">Organisez et suivez vos tâches quotidiennes</p>
                    </div>
                </div>

                <Button
                    onClick={handleOpenCreateModal}>
                    <Plus className="mr-2 h-4 w-4 animate-pulse"/>
                    Nouvelle tâche
                </Button>
            </div>
        </div>
    )
}
