"use client"
import { Trophy, Star, Award, Crown, Sparkles } from "lucide-react"
import type React from "react";


export function AchievementsHeader() {
    return (
        <div
            className="relative overflow-hidden  rounded-lg  bg-blue-100 dark:bg-slate-900 p-6  text-blue-800 dark:text-white">
            <div className="absolute inset-0 dark:bg-black/30"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-blue-800/20 dark:bg-white/10 blur-xl"></div>
            <div
                className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-blue-800/20 dark:bg-white/10 blur-lg"></div>


            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Trophy className="h-8 w-8 animate-bounce text-white"/>
                        <Crown
                            className="absolute -top-2 -right-1 h-5 w-5 animate-pulse text-blue-800 dark:text-yellow-200"/>
                        <Star
                            className="absolute -bottom-1 -left-1 h-4 w-4 animate-spin text-blue-800 dark:text-yellow-300"
                            style={{animationDuration: "2s"}}
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Trophées
                            <Award className="h-6 w-6 animate-pulse text-blue-800 dark:text-yellow-200"/>
                        </h1>
                        <p className="text-blue-800 dark:text-yellow-100">Célébrez vos succès et débloquez de nouveaux
                            trophées</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin text-blue-800 dark:text-yellow-200"/>
                    <span className="text-blue-800 dark:text-yellow-200 font-semibold">Niveau Pro</span>
                </div>
            </div>
        </div>
    )
}
