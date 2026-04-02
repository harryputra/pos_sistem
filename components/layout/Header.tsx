"use client";
import { useAuthStore } from "@/lib/store/auth.store";
import { usePOSStore } from "@/lib/store/pos.store";
import { Bell, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const { currentBranch, user } = useAuthStore();
    const { activeShift } = usePOSStore();

    return (
        <header style={{
            height: "64px", background: "hsl(222,47%,8%)", borderBottom: "1px solid hsl(222,47%,15%)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 1.5rem", flexShrink: 0,
        }}>
            <div>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(213,31%,91%)", lineHeight: 1.2 }}>{title}</h1>
                {subtitle && <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>{subtitle}</p>}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Shift Status */}
                {activeShift && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.75rem", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgb(34,197,94)" }} className="animate-pulse" />
                        <span style={{ fontSize: "0.75rem", color: "rgb(34,197,94)", fontWeight: 500 }}>
                            Shift Aktif
                        </span>
                    </div>
                )}

                {/* Branch */}
                {currentBranch && (
                    <div style={{ padding: "0.35rem 0.75rem", borderRadius: "8px", background: "hsl(222,47%,14%)", border: "1px solid hsl(222,47%,22%)" }}>
                        <span style={{ fontSize: "0.75rem", color: "hsl(215,16%,65%)", fontWeight: 500 }}>{currentBranch.name}</span>
                    </div>
                )}

                {/* Notification Bell */}
                <button style={{ position: "relative", padding: "0.5rem", borderRadius: "8px", background: "hsl(222,47%,14%)", border: "1px solid hsl(222,47%,22%)", cursor: "pointer", color: "hsl(215,16%,65%)", display: "flex", alignItems: "center" }}>
                    <Bell size={16} />
                    <span style={{ position: "absolute", top: "4px", right: "4px", width: "8px", height: "8px", borderRadius: "50%", background: "rgb(239,68,68)" }} />
                </button>

                {/* Time */}
                <div style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={12} />
                    <span>{formatDateTime(new Date())}</span>
                </div>
            </div>
        </header>
    );
}
