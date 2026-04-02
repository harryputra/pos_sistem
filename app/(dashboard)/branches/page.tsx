"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockBranches } from "@/lib/mock-data";
import { Branch } from "@/lib/types";
import { Building2, Plus, Edit2, ToggleLeft, MapPin, Phone, X } from "lucide-react";

const typeLabels: Record<string, string> = { simple: "Sederhana", medium: "Menengah", large: "Besar", warehouse: "Gudang Pusat" };
const typeColors: Record<string, string> = { simple: "rgba(100,116,139,0.15)", medium: "rgba(59,130,246,0.15)", large: "rgba(34,197,94,0.15)", warehouse: "rgba(139,92,246,0.15)" };
const typeTextColors: Record<string, string> = { simple: "rgb(148,163,184)", medium: "rgb(59,130,246)", large: "rgb(34,197,94)", warehouse: "rgb(139,92,246)" };

export default function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>(mockBranches);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", code: "", address: "", phone: "", type: "medium" as Branch["type"], taxRate: 11 });

    const handleAdd = () => {
        const newBranch: Branch = { id: `branch-${Date.now()}`, umkmId: "umkm-001", ...form, isActive: true, createdAt: new Date().toISOString() };
        setBranches([...branches, newBranch]);
        setShowAdd(false);
        setForm({ name: "", code: "", address: "", phone: "", type: "medium", taxRate: 11 });
    };

    const toggleActive = (id: string) => {
        setBranches((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
    };

    return (
        <div>
            <Header title="Manajemen Cabang" subtitle={`${branches.filter((b) => b.isActive).length} cabang aktif`} />
            <div className="page-container">
                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    {Object.entries(typeLabels).map(([type, label]) => {
                        const count = branches.filter((b) => b.type === type).length;
                        return (
                            <div key={type} style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: typeColors[type], border: `1px solid ${typeTextColors[type]}40` }}>
                                <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,55%)", fontWeight: 500 }}>{label}</p>
                                <p style={{ fontSize: "1.25rem", fontWeight: 700, color: typeTextColors[type] }}>{count}</p>
                            </div>
                        );
                    })}
                    <button onClick={() => setShowAdd(true)} style={{ marginLeft: "auto", padding: "0.625rem 1rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Plus size={14} /> Tambah Cabang
                    </button>
                </div>

                {/* Branch Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {branches.map((branch) => (
                        <div key={branch.id} style={{ background: "hsl(222,47%,10%)", border: `1px solid ${branch.isActive ? "hsl(222,47%,20%)" : "rgba(239,68,68,0.2)"}`, borderRadius: "12px", padding: "1.25rem", opacity: branch.isActive ? 1 : 0.7 }} className="card-hover">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: typeColors[branch.type], display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Building2 size={18} color={typeTextColors[branch.type]} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: "hsl(213,31%,91%)", fontSize: "0.95rem" }}>{branch.name}</p>
                                        <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "hsl(215,16%,50%)" }}>{branch.code}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.35rem" }}>
                                    <button style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(59,130,246,0.1)", color: "rgb(59,130,246)", cursor: "pointer" }}><Edit2 size={13} /></button>
                                    <button onClick={() => toggleActive(branch.id)} style={{ padding: "5px", borderRadius: "6px", border: "none", background: branch.isActive ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: branch.isActive ? "rgb(239,68,68)" : "rgb(34,197,94)", cursor: "pointer" }}><ToggleLeft size={13} /></button>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(215,16%,55%)" }}>
                                    <MapPin size={12} style={{ flexShrink: 0, marginTop: "2px" }} />
                                    <span>{branch.address}</span>
                                </div>
                                {branch.phone && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(215,16%,55%)" }}>
                                        <Phone size={12} />
                                        <span>{branch.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid hsl(222,47%,18%)" }}>
                                <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: typeColors[branch.type], color: typeTextColors[branch.type], fontWeight: 600 }}>
                                    {typeLabels[branch.type]}
                                </span>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>PPN: {branch.taxRate}%</span>
                                    <span style={{ fontSize: "0.75rem", padding: "1px 6px", borderRadius: "4px", background: branch.isActive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: branch.isActive ? "rgb(34,197,94)" : "rgb(239,68,68)", fontWeight: 500 }}>
                                        {branch.isActive ? "Aktif" : "Non-aktif"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Modal */}
                {showAdd && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "500px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Tambah Cabang Baru</h2>
                                <button onClick={() => setShowAdd(false)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={14} /></button>
                            </div>
                            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {[
                                    { label: "Nama Cabang *", key: "name", placeholder: "e.g. Cabang Tangerang", full: true },
                                    { label: "Kode Cabang *", key: "code", placeholder: "e.g. TNG" },
                                    { label: "No. Telepon", key: "phone", placeholder: "e.g. 021-555xxxx" },
                                    { label: "Pajak PPN (%)", key: "taxRate", placeholder: "11", type: "number" },
                                    { label: "Alamat Lengkap *", key: "address", placeholder: "Jl. ...", full: true },
                                ].map(({ label, key, placeholder, full, type }) => (
                                    <div key={key} style={{ gridColumn: full ? "1/-1" : undefined }}>
                                        <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>{label}</label>
                                        <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Tipe Cabang *</label>
                                    <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Branch["type"] }))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                                        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                    <button onClick={() => setShowAdd(false)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Batal</button>
                                    <button onClick={handleAdd} disabled={!form.name || !form.code || !form.address} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer", opacity: !form.name || !form.code || !form.address ? 0.5 : 1 }}>Simpan Cabang</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
