"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { PenTool, PlusCircle, BookOpen, Sparkles } from "lucide-react"
import { NoteModalClient } from "@/components/modals/note-modal-client"
import type { CreateNoteInput, UpdateNoteInput } from "@/types/notes"
import { useNotes } from "@/hooks/use-notes"

export function NotesHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { createNote } = useNotes()

    const handleCreateNote = async (data: CreateNoteInput | UpdateNoteInput) => {
        if ("id" in data) {
            return
        }
        await createNote(data as CreateNoteInput)
    }

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
                        <PenTool className="h-8 w-8 animate-pulse text-white"/>
                        <BookOpen className="absolute -bottom-1 -right-1 h-4 w-4 animate-bounce etxt-blue-800 dark:text-yellow-300"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            Notes
                            <Sparkles className="h-6 w-6 animate-spin etxt-blue-800 dark:text-yellow-300"
                                      style={{animationDuration: "2s"}}/>
                        </h1>
                        <p className="text-blue-800 dark:text-white">Gérez vos notes et générez des résumés avec l'IA</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircle className="mr-2 h-4 w-4 animate-pulse"/>
                    Nouvelle note
                </Button>
            </div>

            <NoteModalClient
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateNote}
                title="Créer une nouvelle note"
            />
        </div>
    )
}
