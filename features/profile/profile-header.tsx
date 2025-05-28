"use client"

import { Button } from "@/components/ui/button"
import { User, Settings, Shield, Crown } from "lucide-react"
import type React from "react";

export function ProfileHeader() {
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
                        <User className="h-8 w-8 animate-pulse text-white"/>
                        <Crown className="absolute -top-2 -right-1 h-5 w-5 animate-bounce text-blue-800 dark:text-yellow-300"/>
                        <div
                            className="absolute inset-0 h-8 w-8 rounded-full border-2 border-white/20 animate-ping"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Profil
                            <Shield className="h-6 w-6 animate-pulse text-blue-300"/>
                        </h1>
                        <p className="text-blue-800 dark:text-orange-100">Gérez vos informations personnelles et vos préférences</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
