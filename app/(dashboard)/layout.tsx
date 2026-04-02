"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(222,47%,7%)" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", border: "3px solid hsl(222,47%,25%)", borderTopColor: "hsl(221,83%,53%)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
                    <p style={{ color: "hsl(215,16%,50%)" }}>Memuat...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "hsl(222,47%,7%)" }}>
            <Sidebar />
            <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
                {children}
            </main>
        </div>
    );
}
