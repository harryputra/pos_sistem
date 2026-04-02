"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { DEMO_ACCOUNTS } from "@/lib/mock-data";
import { Eye, EyeOff, ShoppingCart, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) router.push("/");
    };

    const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(acc.email);
        setPassword(acc.password);
    };

    const roleColors: Record<string, string> = {
        owner: "badge-info",
        admin: "badge-success",
        cashier: "badge-warning",
        warehouse: "badge-neutral",
    };
    const roleLabels: Record<string, string> = {
        owner: "Owner",
        admin: "Admin",
        cashier: "Kasir",
        warehouse: "Gudang",
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(222,47%,5%)", padding: "1rem" }}>
            {/* Background blobs */}
            <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
            </div>

            <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", marginBottom: "1rem" }}>
                        <ShoppingCart size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>POS UMKM</h1>
                    <p style={{ color: "hsl(215,16%,55%)", marginTop: "0.25rem", fontSize: "0.875rem" }}>Sistem Multi-Cabang Terintegrasi</p>
                </div>

                {/* Card */}
                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "16px", padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", color: "hsl(213,31%,91%)" }}>Masuk ke Akun Anda</h2>

                    {error && (
                        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", color: "rgb(239,68,68)", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "hsl(213,31%,80%)" }}>Email</label>
                            <div style={{ position: "relative" }}>
                                <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@umkm.com"
                                    required
                                    style={{ width: "100%", padding: "0.625rem 0.75rem 0.625rem 2.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,22%)", fontSize: "0.875rem", background: "hsl(222,47%,12%)", color: "hsl(213,31%,91%)" }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "hsl(213,31%,80%)" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ width: "100%", padding: "0.625rem 2.5rem 0.625rem 2.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,22%)", fontSize: "0.875rem", background: "hsl(222,47%,12%)", color: "hsl(213,31%,91%)" }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "hsl(215,16%,45%)" }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", color: "white", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: isLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: isLoading ? 0.7 : 1, transition: "opacity 0.2s" }}
                        >
                            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Masuk"}
                        </button>
                    </form>
                </div>

                {/* Demo Accounts */}
                <div style={{ marginTop: "1.5rem", background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "16px", padding: "1.25rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "hsl(215,16%,55%)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Akun Demo — Klik untuk mengisi</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {DEMO_ACCOUNTS.map((acc) => (
                            <button
                                key={acc.email}
                                onClick={() => fillDemo(acc)}
                                style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "8px", background: "hsl(222,47%,14%)", border: "1px solid hsl(222,47%,22%)", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                            >
                                <span className={`badge-${acc.role === "owner" ? "info" : acc.role === "admin" ? "success" : acc.role === "cashier" ? "warning" : "neutral"}`} style={{ fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px", whiteSpace: "nowrap", background: acc.role === "owner" ? "rgba(59,130,246,0.15)" : acc.role === "admin" ? "rgba(34,197,94,0.15)" : acc.role === "cashier" ? "rgba(234,179,8,0.15)" : "rgba(100,116,139,0.15)", color: acc.role === "owner" ? "rgb(59,130,246)" : acc.role === "admin" ? "rgb(34,197,94)" : acc.role === "cashier" ? "rgb(234,179,8)" : "rgb(148,163,184)", border: acc.role === "owner" ? "1px solid rgba(59,130,246,0.3)" : acc.role === "admin" ? "1px solid rgba(34,197,94,0.3)" : acc.role === "cashier" ? "1px solid rgba(234,179,8,0.3)" : "1px solid rgba(100,116,139,0.3)" }}>
                                    {roleLabels[acc.role]}
                                </span>
                                <div>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "hsl(213,31%,85%)" }}>{acc.name}</p>
                                    <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,45%)" }}>{acc.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
