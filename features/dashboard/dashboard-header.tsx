"use client"

import { Hand, Sparkles, TrendingUp } from 'lucide-react'
import type React from "react";
import {useAuthStore} from "@/stores";

export function DashboardHeader() {
    const { email, isAuthenticated } = useAuthStore()
    return (
        <div
            className="relative overflow-hidden  rounded-lg  bg-blue-100 dark:bg-slate-900 p-6  text-blue-800 dark:text-white">
            <div className="absolute inset-0 dark:bg-black/30"></div>
            <div className="absolute top-0 left-0 h-20 w-20 rounded-full bg-blue-800/20 dark:bg-white/10 blur-xl"></div>
            <div
                className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-blue-800/20 dark:bg-white/10 blur-lg"></div>


            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Hand className="h-12 w-12 animate-bounce text-white dark:text-yellow-300"/>
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-pulse text-blue-800 dark:text-yellow-200"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                            Tableau de bord
                            <TrendingUp className="h-8 w-8 animate-pulse text-green-300"/>
                        </h1>
                        <p className="text-blue-600 dark:text-blue-100 text-lg">
                            Bienvenue sur votre tableau de bord, <span
                            className="font-semibold text-blue-800 dark:text-yellow-300">{email}</span> ! 👋
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-ping"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-ping animation-delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-ping animation-delay-150"></div>
                </div>
            </div>
        </div>
    )
}
