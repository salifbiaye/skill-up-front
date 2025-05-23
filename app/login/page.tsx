import Link from "next/link"
import { LoginForm } from "@/features/auth/login-form"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-primary/20 via-accent/20 to-background items-center justify-center p-8">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <GraduationCap className="h-10 w-10" />
            <span className="text-3xl font-bold">SkillUp</span>
          </div>
          <h1 className="text-3xl font-bold mb-6">Boostez votre apprentissage</h1>
          <p className="text-muted-foreground mb-8">
            Organisez vos études, suivez votre progression et utilisez l'IA pour améliorer votre apprentissage.
          </p>
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <h3 className="font-bold">Définissez vos objectifs</h3>
                <p className="text-sm text-muted-foreground">Créez des objectifs clairs avec des échéances.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">2</div>
              <div>
                <h3 className="font-bold">Organisez vos tâches</h3>
                <p className="text-sm text-muted-foreground">Divisez votre travail en tâches gérables.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <h3 className="font-bold">Utilisez l'IA pour progresser</h3>
                <p className="text-sm text-muted-foreground">Générez des résumés et testez vos connaissances.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="md:hidden mb-8 flex items-center gap-2 text-primary">
          <GraduationCap className="h-8 w-8" />
          <span className="text-2xl font-bold">SkillUp</span>
        </div>
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Connexion</h2>
          <p className="text-muted-foreground mb-8">Entrez vos identifiants pour accéder à votre compte</p>
          <LoginForm />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <Link href="/register" className="text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
