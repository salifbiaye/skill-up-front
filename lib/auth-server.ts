import { cookies } from "next/headers"

export async function getServerAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  let email: string | null = null

  if (token) {
    try {
      // Requête vers l'API interne pour récupérer le profil utilisateur
      const res = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000"}/api/profile`, {
        headers: {
          Cookie: `auth-token=${token}`,
        },
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        email = data.email || null
      }
    } catch (e) {
      // Ignore l'erreur, email restera null
    }
  }

  return {
    isAuthenticated: !!token,
    token,
    email,
  }
}

