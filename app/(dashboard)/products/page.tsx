"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockProducts, mockStock, mockCategories } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { Search, Plus, Edit2, Eye, ToggleLeft, Package, Filter, Download, Upload, Tag } from "lucide-react";

export default function ProductsPage() {
    const { currentBranch, user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "global" | "local">("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);

    const allCategories = mockCategories.flatMap((c) => [c, ...(c.children || [])]);

    const filtered = mockProducts.filter((p) => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || p.type === typeFilter;
        const matchCat = categoryFilter === "all" || p.categoryId === categoryFilter;
        return matchSearch && matchType && matchCat;
    });

    const getProductStock = (productId: string) => {
        const stk = mockStock.find((s) => s.productId === productId && s.branchId === (currentBranch?.id || "branch-001"));
        return stk?.quantity ?? "-";
    };

    const statusColors = { normal: "badge-success", low: "badge-warning", out: "badge-danger" };
    const statusLabels = { normal: "Normal", low: "Menipis", out: "Habis" };

    const canCreate = user?.role === "owner" || user?.role === "admin" || user?.role === "warehouse";

    return (
        <div>
            <Header title="Manajemen Produk" subtitle={`${filtered.length} produk`} />
            <div className="page-container">
                {/* Toolbar */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                        <input
                            type="text"
                            placeholder="Cari nama produk atau SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", fontSize: "0.85rem" }}
                        />
                    </div>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Tipe</option>
                        <option value="global">Produk Global</option>
                        <option value="local">Produk Lokal</option>
                    </select>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Kategori</option>
                        {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid hsl(222,47%,22%)", background: "hsl(222,47%,14%)", color: "hsl(215,16%,65%)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
                        <Upload size={14} /> Import
                    </button>
                    <button style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid hsl(222,47%,22%)", background: "hsl(222,47%,14%)", color: "hsl(215,16%,65%)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
                        <Download size={14} /> Export
                    </button>
                    {canCreate && (
                        <button onClick={() => setShowAddModal(true)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600 }}>
                            <Plus size={14} /> Tambah Produk
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                    {[
                        { label: "Total Produk", value: mockProducts.length, color: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "rgb(59,130,246)" },
                        { label: "Produk Global", value: mockProducts.filter((p) => p.type === "global").length, color: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", text: "rgb(34,197,94)" },
                        { label: "Produk Lokal", value: mockProducts.filter((p) => p.type === "local").length, color: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "rgb(139,92,246)" },
                        { label: "Non-aktif", value: mockProducts.filter((p) => !p.isActive).length, color: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "rgb(239,68,68)" },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: s.color, border: `1px solid ${s.border}` }}>
                            <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,55%)", fontWeight: 500 }}>{s.label}</p>
                            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: s.text }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["Produk", "SKU / Barcode", "Kategori", "Stok", "Tipe", "Harga Jual", "Status", "Aksi"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((product, i) => {
                                const stockQty = getProductStock(product.id);
                                const stockStatus = typeof stockQty === "number" ? getStockStatus(stockQty, product.minStock) : "normal";
                                return (
                                    <tr key={product.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)", transition: "background 0.1s" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(222,47%,12%)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "hsl(222,47%,18%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Tag size={16} color="hsl(215,16%,50%)" />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{product.name}</p>
                                                    <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{product.unit}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <p style={{ fontSize: "0.82rem", fontFamily: "monospace", color: "hsl(213,31%,80%)" }}>{product.sku}</p>
                                            {product.barcode && <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,45%)" }}>{product.barcode}</p>}
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.78rem", color: "hsl(215,16%,65%)" }}>{product.categoryName}</span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: stockStatus === "out" ? "rgb(239,68,68)" : stockStatus === "low" ? "rgb(234,179,8)" : "hsl(213,31%,91%)" }}>
                                                {stockQty}
                                            </span>
                                            <span style={{ fontSize: "0.68rem", marginLeft: "4px" }}
                                                className={statusColors[stockStatus] || "badge-neutral"}>
                                                {statusLabels[stockStatus]}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600, background: product.type === "global" ? "rgba(59,130,246,0.15)" : "rgba(139,92,246,0.15)", color: product.type === "global" ? "rgb(59,130,246)" : "rgb(139,92,246)", border: product.type === "global" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(139,92,246,0.3)" }}>
                                                {product.type === "global" ? "Global" : "Lokal"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>{formatCurrency(product.sellingPrice)}</p>
                                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,45%)" }}>Beli: {formatCurrency(product.purchasePrice)}</p>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span className={product.isActive ? "badge-success" : "badge-neutral"} style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 500 }}>
                                                {product.isActive ? "Aktif" : "Non-aktif"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <div style={{ display: "flex", gap: "0.35rem" }}>
                                                <button style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(59,130,246,0.1)", color: "rgb(59,130,246)", cursor: "pointer" }} title="Edit">
                                                    <Edit2 size={13} />
                                                </button>
                                                <button style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(34,197,94,0.1)", color: "rgb(34,197,94)", cursor: "pointer" }} title="Detail">
                                                    <Eye size={13} />
                                                </button>
                                                <button style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(234,179,8,0.1)", color: "rgb(234,179,8)", cursor: "pointer" }} title="Aktif/Non-aktif">
                                                    <ToggleLeft size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Add Product Modal */}
                {showAddModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Tambah Produk Baru</h2>
                                <button onClick={() => setShowAddModal(false)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}>✕</button>
                            </div>
                            <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {[
                                    { label: "Nama Produk *", placeholder: "e.g. Aqua 600ml", full: true },
                                    { label: "SKU *", placeholder: "e.g. AQU-600" },
                                    { label: "Barcode", placeholder: "e.g. 8999999900123" },
                                    { label: "Satuan *", placeholder: "e.g. botol" },
                                    { label: "Harga Beli (Rp) *", placeholder: "0" },
                                    { label: "Harga Jual (Rp) *", placeholder: "0" },
                                    { label: "Minimum Stok", placeholder: "0" },
                                ].map(({ label, placeholder, full }) => (
                                    <div key={label} style={{ gridColumn: full ? "1/-1" : undefined }}>
                                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "hsl(215,16%,65%)", marginBottom: "0.35rem" }}>{label}</label>
                                        <input type="text" placeholder={placeholder} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "hsl(215,16%,65%)", marginBottom: "0.35rem" }}>Kategori</label>
                                    <select style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                                        <option value="">Pilih Kategori</option>
                                        {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "hsl(215,16%,65%)", marginBottom: "0.35rem" }}>Tipe Produk</label>
                                    <select style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                                        <option value="global">Global (semua cabang)</option>
                                        <option value="local">Lokal (cabang ini saja)</option>
                                    </select>
                                </div>
                                <div style={{ gridColumn: "1/-1", display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                                    <button onClick={() => setShowAddModal(false)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer", fontWeight: 500 }}>Batal</button>
                                    <button onClick={() => setShowAddModal(false)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Produk</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
