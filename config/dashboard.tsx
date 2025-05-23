import {
  LayoutDashboard,
  Target,
  CheckSquare,
  FileText,
  MessageSquare,
  Settings,
  User,
  DoorClosedIcon
} from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Objectifs",
      href: "/goals",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Tâches",
      href: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Notes",
      href: "/notes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Chat IA",
      href: "/ai-chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Profil",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Déconnexion",
      href: "/logout",
      icon: <DoorClosedIcon className="h-5 w-5" />,
    }
    // {
    //   title: "Paramètres",
    //   href: "/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ],
}
