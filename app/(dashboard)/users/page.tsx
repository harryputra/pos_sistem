"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockUsers, mockBranches } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { User } from "@/lib/types";
import { Users, Plus, Edit2, ToggleLeft, X, Shield } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const roleConfig: Record<string, { label: string; color: string; bg: string }> = {
    owner: { label: "Owner", color: "rgb(59,130,246)", bg: "rgba(59,130,246,0.15)" },
    admin: { label: "Admin Cabang", color: "rgb(34,197,94)", bg: "rgba(34,197,94,0.15)" },
    cashier: { label: "Kasir", color: "rgb(234,179,8)", bg: "rgba(234,179,8,0.15)" },
    warehouse: { label: "Staff Gudang", color: "rgb(148,163,184)", bg: "rgba(148,163,184,0.15)" },
};

export default function UsersPage() {
    const { user } = useAuthStore();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [branchFilter, setBranchFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ fullName: "", email: "", role: "cashier", branchId: "" });

    const filtered = users.filter((u) => {
        const mb = branchFilter === "all" || u.branchId === branchFilter;
        const mr = roleFilter === "all" || u.role === roleFilter;
        return mb && mr;
    });

    const handleAdd = () => {
        const newUser: User = { id: `user-${Date.now()}`, umkmId: "umkm-001", ...form, role: form.role as User["role"], isActive: true, createdAt: new Date().toISOString() };
        setUsers([...users, newUser]);
        setShowAdd(false);
        setForm({ fullName: "", email: "", role: "cashier", branchId: "" });
    };

    const toggleActive = (id: string) => {
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
    };

    const canManage = user?.role === "owner" || user?.role === "admin";

    return (
        <div>
            <Header title="Manajemen Pengguna" subtitle={`${filtered.length} pengguna`} />
            <div className="page-container">
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Cabang</option>
                        {mockBranches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Role</option>
                        {Object.entries(roleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    {canManage && (
                        <button onClick={() => setShowAdd(true)} style={{ marginLeft: "auto", padding: "0.5rem 1rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <Plus size={14} /> Tambah Pengguna
                        </button>
                    )}
                </div>

                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["Pengguna", "Email", "Role", "Cabang", "Login Terakhir", "Status", "Aksi"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => {
                                const rc = roleConfig[u.role];
                                const branch = mockBranches.find((b) => b.id === u.branchId);
                                return (
                                    <tr key={u.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(222,47%,12%)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", color: rc.color }}>
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{u.fullName}</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}><span style={{ fontSize: "0.8rem", color: "hsl(215,16%,65%)" }}>{u.email}</span></td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600, background: rc.bg, color: rc.color }}>{rc.label}</span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}><span style={{ fontSize: "0.8rem", color: "hsl(215,16%,60%)" }}>{branch?.name || "Semua Cabang"}</span></td>
                                        <td style={{ padding: "0.875rem 1rem" }}><span style={{ fontSize: "0.78rem", color: "hsl(215,16%,50%)" }}>{u.lastLogin ? formatDateTime(u.lastLogin) : "-"}</span></td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: u.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: u.isActive ? "rgb(34,197,94)" : "rgb(239,68,68)", fontWeight: 500 }}>
                                                {u.isActive ? "Aktif" : "Non-aktif"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            {canManage && u.id !== user?.id && (
                                                <div style={{ display: "flex", gap: "0.35rem" }}>
                                                    <button style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(59,130,246,0.1)", color: "rgb(59,130,246)", cursor: "pointer" }}><Edit2 size={13} /></button>
                                                    <button onClick={() => toggleActive(u.id)} style={{ padding: "5px", borderRadius: "6px", border: "none", background: u.isActive ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: u.isActive ? "rgb(239,68,68)" : "rgb(34,197,94)", cursor: "pointer" }}><ToggleLeft size={13} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {showAdd && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "460px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Tambah Pengguna</h2>
                                <button onClick={() => setShowAdd(false)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={14} /></button>
                            </div>
                            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {[
                                    { label: "Nama Lengkap *", key: "fullName", placeholder: "Nama pengguna" },
                                    { label: "Email *", key: "email", placeholder: "email@umkm.com", type: "email" },
                                ].map(({ label, key, placeholder, type }) => (
                                    <div key={key}>
                                        <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>{label}</label>
                                        <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Role *</label>
                                    <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                                        {Object.entries(roleConfig).filter(([k]) => k !== "owner").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Cabang</label>
                                    <select value={form.branchId} onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                                        <option value="">Pilih cabang...</option>
                                        {mockBranches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                    <button onClick={() => setShowAdd(false)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Batal</button>
                                    <button onClick={handleAdd} disabled={!form.fullName || !form.email} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer", opacity: !form.fullName || !form.email ? 0.5 : 1 }}>Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
