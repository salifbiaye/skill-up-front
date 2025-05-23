import Link from "next/link"
import { RegisterForm } from "@/features/auth/register-form"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-muted/50 items-center justify-center p-8">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <GraduationCap className="h-10 w-10" />
            <span className="text-3xl font-bold">SkillUp</span>
          </div>
          <h1 className="text-3xl font-bold mb-6">Rejoignez SkillUp aujourd'hui</h1>
          <p className="text-muted-foreground mb-8">
            Créez votre compte et commencez à améliorer votre apprentissage avec l'aide de l'IA.
          </p>
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div>
                <h3 className="font-bold">Gratuit pour commencer</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez toutes les fonctionnalités de base gratuitement.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div>
                <h3 className="font-bold">Pas de carte de crédit requise</h3>
                <p className="text-sm text-muted-foreground">Inscrivez-vous sans engagement.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                ✓
              </div>
              <div>
                <h3 className="font-bold">Annulez à tout moment</h3>
                <p className="text-sm text-muted-foreground">Aucun contrat à long terme.</p>
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
          <h2 className="text-2xl font-bold mb-2">Créer un compte</h2>
          <p className="text-muted-foreground mb-8">Entrez vos informations pour créer votre compte</p>
          <RegisterForm />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
