"use client";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/lib/store/auth.store";
import { useState } from "react";
import { Building, Globe, Bell, Lock, Smartphone, Save, User as UserIcon } from "lucide-react";

export default function SettingsPage() {
    const { user, umkm } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profil Akun", icon: <UserIcon size={18} /> },
        { id: "umkm", label: "Profil Bisnis", icon: <Building size={18} /> },
        { id: "system", label: "Sistem & Pajak", icon: <Globe size={18} /> },
        { id: "notifications", label: "Notifikasi", icon: <Bell size={18} /> },
        { id: "security", label: "Keamanan", icon: <Lock size={18} /> },
    ];

    return (
        <div>
            <Header title="Pengaturan" subtitle="Kelola profil bisnis dan preferensi sistem" />
            <div className="page-container">
                <div style={{ display: "flex", gap: "2rem" }}>
                    {/* Sidebar Tabs */}
                    <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: activeTab === tab.id ? "hsla(221,83%,53%,0.15)" : "transparent",
                                    color: activeTab === tab.id ? "hsl(221,83%,70%)" : "hsl(215,16%,55%)",
                                    fontWeight: activeTab === tab.id ? 600 : 500,
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.2s"
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: 1, background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "16px", padding: "2rem" }}>
                        {activeTab === "profile" && (
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(213,31%,91%)", marginBottom: "1.5rem" }}>Profil Pengguna</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "480px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Nama Lengkap</label>
                                        <input type="text" defaultValue={user?.fullName} style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Email</label>
                                        <input type="email" defaultValue={user?.email} style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Role</label>
                                        <input type="text" value={user?.role.toUpperCase()} disabled style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem", background: "hsl(222,47%,15%)", opacity: 0.7 }} />
                                    </div>
                                    <button style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>
                                        <Save size={18} /> Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "umkm" && (
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(213,31%,91%)", marginBottom: "1.5rem" }}>Profil Bisnis UMKM</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "480px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Nama Bisnis</label>
                                        <input type="text" defaultValue={umkm?.name} style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Tipe Bisnis</label>
                                        <select style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                                            <option>Ritel / Toko Kelontong</option>
                                            <option>F&B / Restoran</option>
                                            <option>Jasa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", color: "hsl(215,16%,60%)", marginBottom: "0.5rem" }}>Alamat Kantor Pusat</label>
                                        <textarea rows={3} style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px", fontSize: "0.9rem", resize: "none" }} defaultValue="Jl. Sudirman No. 123, Jakarta" />
                                    </div>
                                    <button style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>
                                        <Save size={18} /> Simpan Profil Bisnis
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab !== "profile" && activeTab !== "umkm" && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", color: "hsl(215,16%,45%)" }}>
                                <Smartphone size={48} style={{ marginBottom: "1rem", opacity: 0.2 }} />
                                <p>Fitur ini akan segera hadir pada update berikutnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
