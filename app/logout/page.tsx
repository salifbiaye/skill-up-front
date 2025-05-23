"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                router.push("/login");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
                // Rediriger vers la page de connexion même en cas d'erreur
                router.push("/login");
            }
        };

        performLogout();
    }, [logout, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Déconnexion en cours...</p>
        </div>
    );
}
