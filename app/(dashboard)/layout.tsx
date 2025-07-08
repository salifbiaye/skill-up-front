import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { dashboardConfig } from "@/config/dashboard"
import { getServerAuth } from "@/lib/auth-server"
import { AuthProvider } from "@/contexts/AuthProvider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getServerAuth()
  return (
    <AuthProvider initialAuth={auth}>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className=" w-full  flex-1 items-start md:grid md:grid-cols-[240px_1fr  lg:grid-cols-[280px_1fr] ">
          <div className={"hidden  h-full  lg:block overflow-hidden"}>
            <DashboardNav items={dashboardConfig.sidebarNav} />
          </div>
          <main className="flex  w-full flex-col ">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
