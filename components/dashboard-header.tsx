"use client"

import Link from "next/link"
import { GraduationCap, Menu, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardNav } from "@/components/dashboard-nav"
import { dashboardConfig } from "@/config/dashboard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className=" p-6 flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] ">
                <SheetTitle>
                  <div className="flex items-center gap-2 pt-4 pb-8">
                    <GraduationCap className="h-6 w-6 text-primary"/>
                    <span className="text-xl font-bold">SkillUp</span>
                  </div>
                </SheetTitle>

           <div className={"w-full flex justify-center rounded-lg"}>
             <DashboardNav items={dashboardConfig.sidebarNav}/>
           </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SkillUp</span>
            </Link>
            <Link href="/dashboard" className="hidden items-center gap-2 md:flex">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SkillUp</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">

            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/logout">Déconnexion</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
  )
}
