"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {Sidebar, SidebarContent, SidebarFooter} from "@/components/sidebar"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";

interface DashboardNavProps {
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()
  const { email, isAuthenticated } = useAuthStore()

  return (
      <div className={"h-full fixed w-64 flex overflow-hidden"}>

        <Sidebar className="bg-muted dark:bg-slate-900">
          <div className="absolute inset-0 z-0  dark:bg-black/40"></div>

          <SidebarContent className="px-3 z-20 py-6">
            <div className="space-y-1">
              {items.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                          buttonVariants({variant: "ghost"}),
                          pathname.startsWith(item.href)
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-muted dark:text-foreground dark:hover:bg-primary"
                              : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-primary dark:hover:text-foreground dark:hover:underline",
                          "justify-start gap-2 w-full",
                      )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
              ))}
            </div>

          </SidebarContent>
          <SidebarFooter className="border-t z-20 p-4 pb-28">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{email ? email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium">{isAuthenticated ? 'Utilisateur connecté' : 'Non connecté'}</p>
                  <p className="text-xs text-muted-foreground truncate">{email || 'Aucun email'}</p>
                </div>
              </div>

              {isAuthenticated && (
                  <Link
                      href="/logout"
                      className={cn(
                          buttonVariants({variant: "outline"}),
                          "justify-center w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      )}
                  >
                    Déconnecter
                  </Link>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
  )
}
