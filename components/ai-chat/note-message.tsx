"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NoteMessageProps {
  title: string;
  content: string;
  noteId?: string;
  timestamp: string;
}

export function NoteMessage({ title, content, noteId, timestamp }: NoteMessageProps) {
  return (
    <Card className="border-primary/20 bg-primary/5 max-w-full overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">
          {content}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between items-center border-t border-primary/10">
        <span className="text-xs text-muted-foreground">{timestamp}</span>
        {noteId && (
          <Link href={`/notes/${noteId}`} passHref>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <ExternalLink className="h-3 w-3" />
              Voir la note
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
