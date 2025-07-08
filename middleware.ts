import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/", "/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = process.env.NEXT_PUBLIC_ORIGIN || request.nextUrl.origin;

  // Vérifier si la route est publique

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Vérifier l'authentification en utilisant le token JWT du cookie
  const authToken = request.cookies.get('auth-token')?.value
  const isAuthenticated = !!authToken

  // Si la route n'est pas publique et l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isPublicRoute && !isAuthenticated) {
    // Utiliser explicitement l'origine de la requête pour la redirection
    // Redirection absolue obligatoire pour Next.js middleware
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à une page de connexion/inscription, rediriger vers le tableau de bord
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    // Redirection absolue obligatoire pour Next.js middleware
    return NextResponse.redirect(new URL("/dashboard", origin));
  
    // Utiliser explicitement l'origine de la requête pour la redirection
    const dashboardUrl = new URL("/dashboard", origin)
    return NextResponse.redirect(dashboardUrl)
  }

  // Ajouter le token JWT à l'en-tête Authorization pour les requêtes API
  if (pathname.startsWith('/api/') && isAuthenticated) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${authToken}`)

    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Matcher toutes les routes sauf les routes statiques et API
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
