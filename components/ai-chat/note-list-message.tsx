"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, List, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NoteListMessageProps {
  notes: Array<{ id: string; title: string; content?: string }>;
  action: "summarize" | "review" | "list" | "quiz";
  timestamp: string;
}

export function NoteListMessage({ notes, action, timestamp }: NoteListMessageProps) {
  const getActionTitle = () => {
    switch (action) {
      case "summarize":
        return "Résumer mes notes";
      case "review":
        return "Réviser mes notes";
      case "list":
        return "Mes notes";
      case "quiz":
        return "Quiz sur mes notes";
      default:
        return "Mes notes";
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 max-w-full overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
        <List className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium text-primary">{getActionTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="text-sm text-muted-foreground space-y-1">
          {notes.length === 0 ? (
            <p>Aucune note disponible.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id} className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="flex-1 truncate">{note.title}</span>
                  <Link href={`/notes/${note.id}`} passHref>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between items-center border-t border-primary/10">
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </CardFooter>
    </Card>
  );
}
