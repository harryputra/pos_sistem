"use client";
import Header from "@/components/layout/Header";
import { mockStockMovements } from "@/lib/mock-data";
import { formatDateTime, formatNumber } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowLeftRight, RefreshCw } from "lucide-react";

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    in: { label: "Stok Masuk", color: "rgb(34,197,94)", bg: "rgba(34,197,94,0.1)", icon: <ArrowDown size={12} /> },
    out: { label: "Stok Keluar", color: "rgb(239,68,68)", bg: "rgba(239,68,68,0.1)", icon: <ArrowUp size={12} /> },
    transfer_out: { label: "Transfer Keluar", color: "rgb(234,179,8)", bg: "rgba(234,179,8,0.1)", icon: <ArrowLeftRight size={12} /> },
    transfer_in: { label: "Transfer Masuk", color: "rgb(59,130,246)", bg: "rgba(59,130,246,0.1)", icon: <ArrowLeftRight size={12} /> },
    adjustment: { label: "Adjustment", color: "rgb(139,92,246)", bg: "rgba(139,92,246,0.1)", icon: <RefreshCw size={12} /> },
};

export default function StockMovementsPage() {
    return (
        <div>
            <Header title="Riwayat Pergerakan Stok" subtitle="Semua aktivitas masuk/keluar/transfer/adjustment" />
            <div className="page-container">
                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["Produk", "Tipe", "Qty", "Stok Sebelum → Sesudah", "Referensi", "Oleh", "Waktu"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockStockMovements.map((mov) => {
                                const cfg = typeConfig[mov.type] || typeConfig.adjustment;
                                const isPositive = mov.type === "in" || mov.type === "transfer_in";
                                return (
                                    <tr key={mov.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(222,47%,12%)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{mov.productName}</p>
                                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{mov.branchName}</p>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 600, background: cfg.bg, color: cfg.color }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "1rem", fontWeight: 700, color: isPositive ? "rgb(34,197,94)" : "rgb(239,68,68)" }}>
                                                {isPositive ? "+" : "-"}{formatNumber(Math.abs(mov.quantity))}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.85rem", color: "hsl(215,16%,65%)" }}>
                                                {mov.previousStock} → <strong style={{ color: "hsl(213,31%,91%)" }}>{mov.newStock}</strong>
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "rgb(59,130,246)" }}>{mov.referenceNumber || "-"}</span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.8rem", color: "hsl(215,16%,65%)" }}>{mov.createdByName}</span>
                                        </td>
                                        <td style={{ padding: "0.75rem 1rem" }}>
                                            <span style={{ fontSize: "0.78rem", color: "hsl(215,16%,50%)" }}>{formatDateTime(mov.createdAt)}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
