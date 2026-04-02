"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockProducts, mockStock, mockBranches } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { Warehouse, Search, AlertTriangle, TrendingUp, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StockPage() {
    const { currentBranch, user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "normal" | "low" | "out">("all");

    const branchId = currentBranch?.id || "branch-001";

    const stockData = mockProducts
        .filter((p) => p.isActive)
        .map((p) => {
            const stk = mockStock.find((s) => s.productId === p.id && s.branchId === branchId);
            const qty = stk?.quantity ?? 0;
            const status = getStockStatus(qty, p.minStock);
            return { product: p, qty, status };
        })
        .filter(({ product, status }) => {
            const ms = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase());
            const mf = statusFilter === "all" || status === statusFilter;
            return ms && mf;
        });

    const totalValue = stockData.reduce((s, { product, qty }) => s + product.purchasePrice * qty, 0);
    const lowCount = stockData.filter((d) => d.status === "low").length;
    const outCount = stockData.filter((d) => d.status === "out").length;

    return (
        <div>
            <Header title="Manajemen Stok" subtitle={currentBranch?.name} />
            <div className="page-container">
                {/* Summary Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { label: "Total SKU", value: stockData.length, icon: <Package size={18} />, color: "rgba(59,130,246,0.15)", text: "rgb(59,130,246)" },
                        { label: "Nilai Stok", value: formatCurrency(totalValue), icon: <TrendingUp size={18} />, color: "rgba(34,197,94,0.15)", text: "rgb(34,197,94)" },
                        { label: "Stok Menipis", value: lowCount, icon: <AlertTriangle size={18} />, color: "rgba(234,179,8,0.15)", text: "rgb(234,179,8)" },
                        { label: "Stok Habis", value: outCount, icon: <AlertTriangle size={18} />, color: "rgba(239,68,68,0.15)", text: "rgb(239,68,68)" },
                    ].map((c) => (
                        <div key={c.label} style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: c.text, flexShrink: 0 }}>{c.icon}</div>
                            <div>
                                <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>{c.label}</p>
                                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: c.text }}>{c.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <Link href="/stock/in" style={{ padding: "0.625rem 1rem", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "rgb(34,197,94)", fontWeight: 500, fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        + Stok Masuk
                    </Link>
                    <Link href="/stock/transfer" style={{ padding: "0.625rem 1rem", borderRadius: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "rgb(59,130,246)", fontWeight: 500, fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        ↗ Transfer Stok
                    </Link>
                    <Link href="/stock/opname" style={{ padding: "0.625rem 1rem", borderRadius: "8px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "rgb(139,92,246)", fontWeight: 500, fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        ✓ Opname Stok
                    </Link>
                    <Link href="/stock/movements" style={{ padding: "0.625rem 1rem", borderRadius: "8px", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "rgb(234,179,8)", fontWeight: 500, fontSize: "0.85rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        📋 Riwayat Pergerakan
                    </Link>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                        <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Status</option>
                        <option value="normal">Normal</option>
                        <option value="low">Menipis</option>
                        <option value="out">Habis</option>
                    </select>
                </div>

                {/* Stock Table */}
                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["Produk", "SKU", "Kategori", "Stok Saat Ini", "Min. Stok", "Status", "Nilai Stok"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map(({ product, qty, status }) => (
                                <tr key={product.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(222,47%,12%)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{product.name}</p>
                                        <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{product.unit}</p>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "hsl(213,31%,75%)" }}>{product.sku}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontSize: "0.8rem", color: "hsl(215,16%,60%)" }}>{product.categoryName}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            {status !== "normal" && <AlertTriangle size={14} color={status === "out" ? "rgb(239,68,68)" : "rgb(234,179,8)"} />}
                                            <span style={{ fontSize: "1rem", fontWeight: 700, color: status === "out" ? "rgb(239,68,68)" : status === "low" ? "rgb(234,179,8)" : "hsl(213,31%,91%)" }}>
                                                {qty}
                                            </span>
                                            <span style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>{product.unit}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontSize: "0.85rem", color: "hsl(215,16%,60%)" }}>{product.minStock}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 500, ...(status === "normal" ? { background: "rgba(34,197,94,0.15)", color: "rgb(34,197,94)", border: "1px solid rgba(34,197,94,0.3)" } : status === "low" ? { background: "rgba(234,179,8,0.15)", color: "rgb(234,179,8)", border: "1px solid rgba(234,179,8,0.3)" } : { background: "rgba(239,68,68,0.15)", color: "rgb(239,68,68)", border: "1px solid rgba(239,68,68,0.3)" }) }}>
                                            {status === "normal" ? "Normal" : status === "low" ? "Menipis" : "Habis"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,85%)" }}>{formatCurrency(product.purchasePrice * qty)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
