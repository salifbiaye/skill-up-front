import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap, ArrowRight, Brain, ListChecks, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SkillUp</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Accueil
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              Comment ça marche
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background z-0"></div>
          <div className="container relative z-10 py-24 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
              Atteignez vos objectifs d'apprentissage avec <span className="text-primary">SkillUp</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              Organisez vos études, suivez votre progression et utilisez l'IA pour améliorer votre apprentissage.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Fonctionnalités principales</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour réussir vos études et atteindre vos objectifs d'apprentissage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-start p-6 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Prise de notes intelligente</h3>
                <p className="text-muted-foreground mb-4">
                  Organisez vos notes d'études avec support Markdown et générez des résumés avec l'IA.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  Essayer <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-start p-6 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <ListChecks className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gestion des tâches</h3>
                <p className="text-muted-foreground mb-4">
                  Planifiez vos tâches d'apprentissage, définissez des échéances et suivez votre progression.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  Essayer <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-start p-6 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Assistant IA</h3>
                <p className="text-muted-foreground mb-4">
                  Posez des questions, obtenez des explications et générez du contenu avec notre assistant IA.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  Essayer <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Comment ça marche</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Une approche simple et efficace pour améliorer votre apprentissage
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Prenez des notes</h3>
                <p className="text-muted-foreground">
                  Capturez vos idées et connaissances dans notre éditeur avec support Markdown pour une organisation claire.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Planifiez vos tâches</h3>
                <p className="text-muted-foreground">
                  Créez des tâches avec des échéances et suivez votre progression pour rester organisé et productif.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border flex flex-col items-center text-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Utilisez l'IA</h3>
                <p className="text-muted-foreground">
                  Posez des questions à notre assistant IA pour approfondir vos connaissances et générer des résumés.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-background to-primary/5">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre apprentissage ?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Rejoignez SkillUp aujourd'hui et découvrez comment notre plateforme peut vous aider à atteindre vos objectifs d'apprentissage.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    Créer un compte gratuit
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SkillUp</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Votre plateforme d'apprentissage personnel pour atteindre vos objectifs académiques.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Comment ça marche
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SkillUp. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
