import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap, ArrowRight } from "lucide-react"

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
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Témoignages
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
            <div className="mt-16 relative w-full max-w-4xl">
              <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-2xl border">
                <img
                  src="/placeholder.svg?height=720&width=1280"
                  alt="SkillUp Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
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
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Objectifs intelligents</h3>
                <p className="text-muted-foreground mb-4">
                  Définissez des objectifs clairs avec des échéances et suivez votre progression en temps réel.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-start p-6 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Gestion des tâches</h3>
                <p className="text-muted-foreground mb-4">
                  Organisez votre travail en tâches planifiées et suivez votre progression étape par étape.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col items-start p-6 bg-background rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Assistant IA</h3>
                <p className="text-muted-foreground mb-4">
                  Utilisez notre IA pour générer des résumés, poser des questions et améliorer votre apprentissage.
                </p>
                <Link href="/register" className="text-primary font-medium flex items-center mt-auto">
                  En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">Comment ça marche</h2>
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Créez des objectifs d'apprentissage</h3>
                      <p className="text-muted-foreground mt-2">
                        Définissez ce que vous voulez accomplir et quand. Notre système vous aide à établir des
                        objectifs réalistes.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Organisez vos tâches</h3>
                      <p className="text-muted-foreground mt-2">
                        Divisez votre objectif en tâches gérables. Notre système vous propose une planification
                        optimale.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Utilisez l'IA pour progresser</h3>
                      <p className="text-muted-foreground mt-2">
                        Générez des résumés de vos notes et testez vos connaissances avec des questions personnalisées.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="flex-1 rounded-lg overflow-hidden shadow-lg border">
                <img src="/placeholder.svg?height=400&width=600" alt="SkillUp en action" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Ce que disent nos utilisateurs</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment SkillUp aide les étudiants à atteindre leurs objectifs d'apprentissage.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-bold">Thomas L.</p>
                    <p className="text-sm text-muted-foreground">Étudiant en informatique</p>
                  </div>
                </div>
                <p className="italic">
                  "Grâce à SkillUp, j'ai pu organiser mes révisions et obtenir d'excellentes notes à mes examens
                  d'algorithmique."
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <span className="text-accent font-bold">S</span>
                  </div>
                  <div>
                    <p className="font-bold">Sophie M.</p>
                    <p className="text-sm text-muted-foreground">Étudiante en médecine</p>
                  </div>
                </div>
                <p className="italic">
                  "Les résumés générés par l'IA m'ont fait gagner un temps précieux. Je recommande vivement cette
                  plateforme."
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">L</span>
                  </div>
                  <div>
                    <p className="font-bold">Lucas D.</p>
                    <p className="text-sm text-muted-foreground">Étudiant en droit</p>
                  </div>
                </div>
                <p className="italic">
                  "La fonction de révision avec l'IA est incroyable. Elle m'a aidé à identifier mes points faibles et à
                  mieux me préparer."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à améliorer votre apprentissage ?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'étudiants qui utilisent SkillUp pour atteindre leurs objectifs académiques.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-12 px-8">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SkillUp</span>
            </div>
            <p className="text-muted-foreground">Améliorez votre apprentissage avec l'IA.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">contact@skillup.fr</li>
              <li className="text-muted-foreground">+33 1 23 45 67 89</li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground">© 2025 SkillUp. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
