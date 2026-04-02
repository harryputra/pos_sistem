"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { usePOSStore } from "@/lib/store/pos.store";
import { UserRole } from "@/lib/types";
import {
    LayoutDashboard, ShoppingCart, Package, Warehouse, ArrowLeftRight,
    BarChart3, Users, Settings, ChevronLeft, ChevronRight, Bell, LogOut,
    Building2, ClipboardList, Clock, ChevronDown, Wifi, WifiOff, Store
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: number;
    children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/", icon: <LayoutDashboard size={18} />, roles: ["owner", "admin", "cashier", "warehouse"] },
    { title: "Kasir (POS)", href: "/pos", icon: <ShoppingCart size={18} />, roles: ["cashier", "admin", "owner"] },
    { title: "Produk", href: "/products", icon: <Package size={18} />, roles: ["owner", "admin", "warehouse"] },
    {
        title: "Stok", href: "/stock", icon: <Warehouse size={18} />, roles: ["owner", "admin", "warehouse"], children: [
            { title: "Overview Stok", href: "/stock" },
            { title: "Stok Masuk", href: "/stock/in" },
            { title: "Transfer Stok", href: "/stock/transfer" },
            { title: "Opname Stok", href: "/stock/opname" },
            { title: "Riwayat Pergerakan", href: "/stock/movements" },
        ]
    },
    { title: "Transaksi", href: "/transactions", icon: <ClipboardList size={18} />, roles: ["owner", "admin"] },
    { title: "Shift Kasir", href: "/shifts", icon: <Clock size={18} />, roles: ["owner", "admin", "cashier"] },
    { title: "Laporan", href: "/reports", icon: <BarChart3 size={18} />, roles: ["owner", "admin"] },
    { title: "Cabang", href: "/branches", icon: <Building2 size={18} />, roles: ["owner"] },
    { title: "Pengguna", href: "/users", icon: <Users size={18} />, roles: ["owner", "admin"] },
    { title: "Pengaturan", href: "/settings", icon: <Settings size={18} />, roles: ["owner", "admin"] },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const pathname = usePathname();
    const { user, currentBranch, availableBranches, switchBranch, logout } = useAuthStore();
    const { isOffline, pendingSync } = usePOSStore();

    const userRole = user?.role as UserRole;
    const filteredItems = navItems.filter((i) => i.roles.includes(userRole));

    const isActive = (href: string) => {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    const getRoleLabel = (role?: UserRole) => {
        const labels: Record<string, string> = { owner: "Owner", admin: "Admin Cabang", cashier: "Kasir", warehouse: "Staff Gudang" };
        return labels[role || ""] || role;
    };

    const getRoleColor = (role?: UserRole) => {
        const colors: Record<string, string> = {
            owner: "rgba(59,130,246,0.15)",
            admin: "rgba(34,197,94,0.15)",
            cashier: "rgba(234,179,8,0.15)",
            warehouse: "rgba(100,116,139,0.15)",
        };
        return colors[role || ""] || "rgba(100,116,139,0.15)";
    };
    const getRoleTextColor = (role?: UserRole) => {
        const colors: Record<string, string> = {
            owner: "rgb(59,130,246)",
            admin: "rgb(34,197,94)",
            cashier: "rgb(234,179,8)",
            warehouse: "rgb(148,163,184)",
        };
        return colors[role || ""] || "rgb(148,163,184)";
    };

    return (
        <aside style={{
            width: collapsed ? "68px" : "var(--sidebar-width, 260px)",
            minHeight: "100vh",
            background: "hsl(222,47%,8%)",
            borderRight: "1px solid hsl(222,47%,15%)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.25s ease",
            position: "relative",
            flexShrink: 0,
        }}>
            {/* Logo */}
            <div style={{ padding: "1rem", borderBottom: "1px solid hsl(222,47%,15%)", display: "flex", alignItems: "center", gap: "0.75rem", minHeight: "64px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Store size={18} color="white" />
                </div>
                {!collapsed && (
                    <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "hsl(213,31%,91%)", whiteSpace: "nowrap" }}>POS UMKM</p>
                        <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)", whiteSpace: "nowrap" }}>Multi-Cabang</p>
                    </div>
                )}
            </div>

            {/* Branch Selector (for owner) */}
            {!collapsed && userRole === "owner" && availableBranches.length > 1 && (
                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid hsl(222,47%,15%)" }}>
                    <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,45%)", marginBottom: "0.35rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cabang Aktif</p>
                    <select
                        value={currentBranch?.id || ""}
                        onChange={(e) => switchBranch(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.5rem", borderRadius: "6px", border: "1px solid hsl(222,47%,22%)", background: "hsl(222,47%,12%)", color: "hsl(213,31%,91%)", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                        {availableBranches.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Nav Items */}
            <nav style={{ flex: 1, padding: "0.5rem", overflowY: "auto" }}>
                {filteredItems.map((item) => {
                    const active = isActive(item.href);
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedItem === item.href;

                    return (
                        <div key={item.href}>
                            {hasChildren ? (
                                <button
                                    onClick={() => setExpandedItem(isExpanded ? null : item.href)}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                                        padding: collapsed ? "0.625rem" : "0.625rem 0.75rem",
                                        borderRadius: "8px", border: "none", cursor: "pointer",
                                        background: active || isExpanded ? "rgba(59,130,246,0.1)" : "transparent",
                                        color: active || isExpanded ? "rgb(59,130,246)" : "hsl(215,16%,65%)",
                                        marginBottom: "2px", transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start",
                                    }}
                                >
                                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                    {!collapsed && (
                                        <>
                                            <span style={{ fontSize: "0.85rem", fontWeight: 500, flex: 1, textAlign: "left" }}>{item.title}</span>
                                            <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.75rem",
                                        padding: collapsed ? "0.625rem" : "0.625rem 0.75rem",
                                        borderRadius: "8px",
                                        background: active ? "rgba(59,130,246,0.1)" : "transparent",
                                        color: active ? "rgb(59,130,246)" : "hsl(215,16%,65%)",
                                        marginBottom: "2px", transition: "all 0.15s", textDecoration: "none",
                                        justifyContent: collapsed ? "center" : "flex-start",
                                    }}
                                >
                                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                    {!collapsed && <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{item.title}</span>}
                                </Link>
                            )}

                            {/* Children */}
                            {hasChildren && isExpanded && !collapsed && (
                                <div style={{ paddingLeft: "2.5rem", marginBottom: "4px" }}>
                                    {item.children!.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            style={{
                                                display: "block", padding: "0.4rem 0.75rem", borderRadius: "6px",
                                                fontSize: "0.8rem", color: pathname === child.href ? "rgb(59,130,246)" : "hsl(215,16%,55%)",
                                                background: pathname === child.href ? "rgba(59,130,246,0.08)" : "transparent",
                                                textDecoration: "none", marginBottom: "1px", transition: "all 0.15s",
                                            }}
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Offline Status */}
            {!collapsed && (
                <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid hsl(222,47%,15%)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: "8px", background: isOffline ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${isOffline ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
                        {isOffline ? <WifiOff size={14} color="rgb(239,68,68)" /> : <Wifi size={14} color="rgb(34,197,94)" />}
                        <span style={{ fontSize: "0.75rem", color: isOffline ? "rgb(239,68,68)" : "rgb(34,197,94)", fontWeight: 500 }}>
                            {isOffline ? `Offline (${pendingSync} pending)` : "Online"}
                        </span>
                    </div>
                </div>
            )}

            {/* User Info */}
            <div style={{ padding: "0.75rem", borderTop: "1px solid hsl(222,47%,15%)" }}>
                {!collapsed ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", color: "white", flexShrink: 0 }}>
                            {user?.fullName.charAt(0)}
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "hsl(213,31%,91%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.fullName}</p>
                            <span style={{ fontSize: "0.65rem", fontWeight: 600, padding: "1px 6px", borderRadius: "9999px", background: getRoleColor(userRole), color: getRoleTextColor(userRole) }}>
                                {getRoleLabel(userRole)}
                            </span>
                        </div>
                        <button onClick={logout} style={{ padding: "6px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }} title="Logout">
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <button onClick={logout} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Logout">
                        <LogOut size={16} />
                    </button>
                )}
            </div>

            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    position: "absolute", right: "-12px", top: "50%", transform: "translateY(-50%)",
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: "hsl(222,47%,15%)", border: "1px solid hsl(222,47%,22%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "hsl(215,16%,65%)", zIndex: 10,
                }}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
        </aside>
    );
}
