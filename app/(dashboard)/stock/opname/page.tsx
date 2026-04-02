"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockProducts, mockStock } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { getStockStatus } from "@/lib/utils";
import { CheckSquare, AlertTriangle } from "lucide-react";

export default function OpnamePage() {
    const { currentBranch } = useAuthStore();
    const branchId = currentBranch?.id || "branch-001";

    const opnameData = mockProducts.filter((p) => p.isActive).map((p) => {
        const stk = mockStock.find((s) => s.productId === p.id && s.branchId === branchId);
        return { product: p, systemQty: stk?.quantity ?? 0 };
    });

    const [physicalQty, setPhysicalQty] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const getPhysical = (productId: string, defaultQty: number) => {
        if (physicalQty[productId] === undefined) return defaultQty;
        return parseInt(physicalQty[productId]) || 0;
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    };

    return (
        <div>
            <Header title="Opname Stok" subtitle="Cocokkan stok fisik dengan stok sistem" />
            <div className="page-container">
                {submitted && (
                    <div style={{ marginBottom: "1rem", padding: "0.875rem 1rem", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "rgb(34,197,94)", fontWeight: 500, textAlign: "center" }}>
                        ✅ Opname stok berhasil disimpan dan adjustment diterapkan!
                    </div>
                )}
                <div style={{ marginBottom: "1rem", padding: "0.875rem 1rem", borderRadius: "10px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", fontSize: "0.85rem", color: "hsl(215,16%,65%)" }}>
                    📋 Masukkan stok fisik yang dihitung. Selisih akan dicatat sebagai adjustment otomatis.
                </div>

                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["Produk", "SKU", "Stok Sistem", "Stok Fisik", "Selisih", "Status"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {opnameData.map(({ product, systemQty }) => {
                                const physical = getPhysical(product.id, systemQty);
                                const diff = physical - systemQty;
                                return (
                                    <tr key={product.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)" }}>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{product.name}</p>
                                            <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)" }}>{product.unit}</p>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "hsl(213,31%,75%)" }}>{product.sku}</span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "hsl(213,31%,85%)" }}>{systemQty}</span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <input
                                                type="number"
                                                min={0}
                                                value={physicalQty[product.id] ?? systemQty}
                                                onChange={(e) => setPhysicalQty((prev) => ({ ...prev, [product.id]: e.target.value }))}
                                                style={{ width: "80px", padding: "0.35rem 0.5rem", borderRadius: "6px", fontSize: "0.85rem", border: diff !== 0 ? "1px solid rgba(234,179,8,0.5)" : "1px solid hsl(222,47%,22%)" }}
                                            />
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: diff > 0 ? "rgb(34,197,94)" : diff < 0 ? "rgb(239,68,68)" : "hsl(215,16%,55%)" }}>
                                                {diff > 0 ? `+${diff}` : diff}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            {diff !== 0 ? (
                                                <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: diff > 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: diff > 0 ? "rgb(34,197,94)" : "rgb(239,68,68)", border: `1px solid ${diff > 0 ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontWeight: 500 }}>
                                                    {diff > 0 ? "Surplus" : "Kurang"}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: "0.75rem", color: "hsl(215,16%,40%)" }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={handleSubmit} style={{ padding: "0.75rem 1.5rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CheckSquare size={16} /> Simpan Hasil Opname
                    </button>
                </div>
            </div>
        </div>
    );
}
