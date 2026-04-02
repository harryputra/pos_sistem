"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { usePOSStore } from "@/lib/store/pos.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Search, Filter, Eye, XCircle, RefreshCw } from "lucide-react";

const methodLabels: Record<string, string> = { cash: "Tunai", card: "Kartu", qris: "QRIS", transfer: "Transfer", split: "Split" };
const methodColors: Record<string, string> = { cash: "rgb(34,197,94)", card: "rgb(59,130,246)", qris: "rgb(139,92,246)", transfer: "rgb(234,179,8)", split: "rgb(234,179,8)" };
const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    completed: { bg: "rgba(34,197,94,0.1)", color: "rgb(34,197,94)", border: "rgba(34,197,94,0.3)" },
    voided: { bg: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", border: "rgba(239,68,68,0.3)" },
    refunded: { bg: "rgba(234,179,8,0.1)", color: "rgb(234,179,8)", border: "rgba(234,179,8,0.3)" },
    pending: { bg: "rgba(100,116,139,0.1)", color: "rgb(100,116,139)", border: "rgba(100,116,139,0.3)" },
};

export default function TransactionsPage() {
    const { transactions, voidTransaction } = usePOSStore();
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [selectedTrx, setSelectedTrx] = useState<any>(null);

    const filtered = transactions.filter((t) => {
        const ms = !search || t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || (t.cashierName || "").toLowerCase().includes(search.toLowerCase());
        const mst = statusFilter === "all" || t.status === statusFilter;
        const mm = methodFilter === "all" || t.paymentMethod === methodFilter;
        return ms && mst && mm;
    });

    const totalRevenue = filtered.filter((t) => t.status === "completed").reduce((s, t) => s + t.totalAmount, 0);

    return (
        <div>
            <Header title="Riwayat Transaksi" subtitle={`${filtered.length} transaksi`} />
            <div className="page-container">
                {/* Summary */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { label: "Total Pendapatan", value: formatCurrency(totalRevenue), color: "rgb(34,197,94)" },
                        { label: "Selesai", value: filtered.filter((t) => t.status === "completed").length, color: "rgb(34,197,94)" },
                        { label: "Void", value: filtered.filter((t) => t.status === "voided").length, color: "rgb(239,68,68)" },
                        { label: "Refund", value: filtered.filter((t) => t.status === "refunded").length, color: "rgb(234,179,8)" },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: "0.875rem 1.25rem", borderRadius: "10px", background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)" }}>
                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)", marginBottom: "4px", fontWeight: 500 }}>{s.label}</p>
                            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                        <input type="text" placeholder="Cari No. Invoice atau kasir..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Status</option>
                        <option value="completed">Selesai</option>
                        <option value="voided">Void</option>
                        <option value="refunded">Refund</option>
                    </select>
                    <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                        <option value="all">Semua Metode</option>
                        <option value="cash">Tunai</option>
                        <option value="card">Kartu</option>
                        <option value="qris">QRIS</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                {/* Table */}
                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "hsl(222,47%,13%)" }}>
                                {["No. Invoice", "Kasir / Cabang", "Metode", "Total", "Status", "Waktu", "Aksi"].map((h) => (
                                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem", color: "hsl(215,16%,50%)", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((trx) => {
                                const sc = statusColors[trx.status] || statusColors.pending;
                                return (
                                    <tr key={trx.id} style={{ borderBottom: "1px solid hsl(222,47%,15%)", cursor: "pointer" }}
                                        onClick={() => setSelectedTrx(trx)}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(222,47%,12%)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 600, fontFamily: "monospace", color: "hsl(213,31%,91%)" }}>{trx.invoiceNumber}</p>
                                            {trx.syncStatus === "pending" && <span style={{ fontSize: "0.68rem", color: "rgb(234,179,8)" }}>⏳ Offline</span>}
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <p style={{ fontSize: "0.82rem", color: "hsl(213,31%,85%)" }}>{trx.cashierName}</p>
                                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{trx.branchName}</p>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: methodColors[trx.paymentMethod] || "hsl(213,31%,75%)" }}>
                                                {methodLabels[trx.paymentMethod] || trx.paymentMethod}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>{formatCurrency(trx.totalAmount)}</p>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600, ...sc }}>
                                                {trx.status === "completed" ? "Selesai" : trx.status === "voided" ? "Void" : trx.status === "refunded" ? "Refund" : "Pending"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }}>
                                            <span style={{ fontSize: "0.78rem", color: "hsl(215,16%,50%)" }}>{formatDateTime(trx.createdAt)}</span>
                                        </td>
                                        <td style={{ padding: "0.875rem 1rem" }} onClick={(e) => e.stopPropagation()}>
                                            <div style={{ display: "flex", gap: "0.35rem" }}>
                                                <button onClick={() => setSelectedTrx(trx)} style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(59,130,246,0.1)", color: "rgb(59,130,246)", cursor: "pointer" }} title="Detail"><Eye size={13} /></button>
                                                {trx.status === "completed" && (user?.role === "owner" || user?.role === "admin") && (
                                                    <button onClick={() => voidTransaction(trx.id, user.id)} style={{ padding: "5px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }} title="Void"><XCircle size={13} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Detail Modal */}
                {selectedTrx && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "460px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)", fontSize: "1rem" }}>Detail {selectedTrx.invoiceNumber}</h2>
                                <button onClick={() => setSelectedTrx(null)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}>✕</button>
                            </div>
                            <div style={{ padding: "1.25rem 1.5rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.82rem" }}>
                                    <div><span style={{ color: "hsl(215,16%,50%)" }}>Kasir</span><p style={{ fontWeight: 500, color: "hsl(213,31%,85%)" }}>{selectedTrx.cashierName}</p></div>
                                    <div><span style={{ color: "hsl(215,16%,50%)" }}>Cabang</span><p style={{ fontWeight: 500, color: "hsl(213,31%,85%)" }}>{selectedTrx.branchName}</p></div>
                                    <div><span style={{ color: "hsl(215,16%,50%)" }}>Metode</span><p style={{ fontWeight: 500, color: methodColors[selectedTrx.paymentMethod] }}>{methodLabels[selectedTrx.paymentMethod]}</p></div>
                                    <div><span style={{ color: "hsl(215,16%,50%)" }}>Waktu</span><p style={{ fontWeight: 500, color: "hsl(213,31%,85%)" }}>{formatDateTime(selectedTrx.createdAt)}</p></div>
                                </div>
                                <div style={{ borderTop: "1px solid hsl(222,47%,18%)", paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                                    {selectedTrx.items?.map((item: any) => (
                                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "0.82rem" }}>
                                            <span style={{ color: "hsl(213,31%,80%)" }}>{item.productName} x{item.quantity}</span>
                                            <span style={{ color: "hsl(213,31%,85%)", fontWeight: 500 }}>{formatCurrency(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ borderTop: "1px solid hsl(222,47%,18%)", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                    {[
                                        { label: "Subtotal", value: formatCurrency(selectedTrx.subtotal) },
                                        ...(selectedTrx.discountAmount > 0 ? [{ label: "Diskon", value: `-${formatCurrency(selectedTrx.discountAmount)}` }] : []),
                                        { label: "PPN 11%", value: formatCurrency(selectedTrx.taxAmount) },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "hsl(215,16%,60%)" }}>
                                            <span>{label}</span><span>{value}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", color: "hsl(213,31%,91%)", borderTop: "1px solid hsl(222,47%,20%)", marginTop: "4px", paddingTop: "4px" }}>
                                        <span>TOTAL</span><span style={{ color: "rgb(59,130,246)" }}>{formatCurrency(selectedTrx.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
