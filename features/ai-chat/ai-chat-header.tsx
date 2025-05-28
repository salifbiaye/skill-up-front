"use client"

import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Brain, MessageCircle } from "lucide-react"

export function AiChatHeader() {
    return (
        <div className="relative overflow-hidden  bg-primary p-6 text-white">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute -top-4 left-1/3 h-20 w-20 rounded-full bg-white/10 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 right-1/4 h-16 w-16 rounded-full bg-white/10 blur-lg animate-pulse animation-delay-75"></div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bot className="h-8 w-8 animate-pulse text-white" />
                        <Brain className="absolute -top-1 -right-1 h-4 w-4 animate-bounce text-pink-300" />
                        <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-white/20 animate-ping"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Assistant IA
                            <Sparkles className="h-6 w-6 animate-spin text-yellow-300" style={{ animationDuration: "2s" }} />
                        </h1>
                        <p className="text-indigo-100">Discutez avec votre assistant intelligent</p>
                    </div>
                </div>


            </div>
        </div>
    )
}
