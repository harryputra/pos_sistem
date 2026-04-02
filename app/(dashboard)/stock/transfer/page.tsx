"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockStockTransfers, mockBranches, mockProducts } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { generateTransferNumber, formatDateTime } from "@/lib/utils";
import { ArrowRight, Plus, CheckCircle2, XCircle, Clock, Truck, X } from "lucide-react";
import { StockTransfer } from "@/lib/types";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    pending: { label: "Menunggu", color: "rgb(234,179,8)", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)", icon: <Clock size={12} /> },
    approved: { label: "Disetujui", color: "rgb(59,130,246)", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", icon: <CheckCircle2 size={12} /> },
    in_transit: { label: "Dalam Pengiriman", color: "rgb(139,92,246)", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", icon: <Truck size={12} /> },
    completed: { label: "Selesai", color: "rgb(34,197,94)", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", icon: <CheckCircle2 size={12} /> },
    rejected: { label: "Ditolak", color: "rgb(239,68,68)", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", icon: <XCircle size={12} /> },
    cancelled: { label: "Dibatalkan", color: "rgb(100,116,139)", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.3)", icon: <XCircle size={12} /> },
};

export default function StockTransferPage() {
    const { user, currentBranch } = useAuthStore();
    const [transfers, setTransfers] = useState<StockTransfer[]>(mockStockTransfers);
    const [filter, setFilter] = useState("all");
    const [showNew, setShowNew] = useState(false);
    const [showDetail, setShowDetail] = useState<StockTransfer | null>(null);
    // New transfer form
    const [toBranch, setToBranch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [qty, setQty] = useState(1);
    const [notes, setNotes] = useState("");
    const [formItems, setFormItems] = useState<{ productId: string; qty: number }[]>([]);

    const filtered = transfers.filter((t) => filter === "all" || t.status === filter);

    const handleCreateTransfer = () => {
        if (!toBranch || formItems.length === 0) return;
        const newTransfer: StockTransfer = {
            id: `trf-${Date.now()}`,
            transferNumber: generateTransferNumber(),
            fromBranchId: currentBranch?.id || "branch-001",
            fromBranchName: currentBranch?.name || "",
            toBranchId: toBranch,
            toBranchName: mockBranches.find((b) => b.id === toBranch)?.name || "",
            status: "pending",
            notes,
            requestedBy: user?.id || "",
            requestedByName: user?.fullName || "",
            requestedAt: new Date().toISOString(),
            items: formItems.map((fi, i) => {
                const prod = mockProducts.find((p) => p.id === fi.productId);
                return { id: `ti-new-${i}`, transferId: "", productId: fi.productId, productName: prod?.name || "", quantity: fi.qty, unit: prod?.unit || "" };
            }),
        };
        setTransfers([newTransfer, ...transfers]);
        setShowNew(false);
        setFormItems([]);
        setNotes("");
        setToBranch("");
    };

    const handleUpdateStatus = (transferId: string, newStatus: StockTransfer["status"]) => {
        setTransfers((prev) => prev.map((t) => t.id === transferId ? { ...t, status: newStatus, ...(newStatus === "completed" ? { completedAt: new Date().toISOString(), approvedBy: user?.id, approvedByName: user?.fullName } : {}) } : t));
        setShowDetail(null);
    };

    return (
        <div>
            <Header title="Transfer Stok" subtitle="Kelola perpindahan stok antar cabang" />
            <div className="page-container">
                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    {Object.entries(statusConfig).map(([key, cfg]) => {
                        const count = transfers.filter((t) => t.status === key).length;
                        return (
                            <button key={key} onClick={() => setFilter(filter === key ? "all" : key)} style={{ padding: "0.625rem 1rem", borderRadius: "10px", background: filter === key ? cfg.bg : "hsl(222,47%,12%)", border: `1px solid ${filter === key ? cfg.border : "hsl(222,47%,20%)"}`, color: filter === key ? cfg.color : "hsl(215,16%,60%)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 500, transition: "all 0.15s" }}>
                                {cfg.icon} {cfg.label} ({count})
                            </button>
                        );
                    })}
                    <button onClick={() => setShowNew(true)} style={{ marginLeft: "auto", padding: "0.625rem 1rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Plus size={14} /> Buat Transfer
                    </button>
                </div>

                {/* Transfer List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {filtered.map((transfer) => {
                        const cfg = statusConfig[transfer.status];
                        return (
                            <div key={transfer.id} style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1rem 1.25rem", cursor: "pointer", transition: "all 0.15s" }}
                                onClick={() => setShowDetail(transfer)}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "hsl(221,83%,53%)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(222,47%,18%)")}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div>
                                            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(213,31%,91%)", marginBottom: "2px" }}>{transfer.transferNumber}</p>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(215,16%,60%)" }}>
                                                <span style={{ fontWeight: 500, color: "hsl(215,16%,75%)" }}>{transfer.fromBranchName}</span>
                                                <ArrowRight size={12} />
                                                <span style={{ fontWeight: 500, color: "hsl(215,16%,75%)" }}>{transfer.toBranchName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontSize: "0.78rem", color: "hsl(215,16%,50%)" }}>{transfer.items.length} produk</p>
                                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,45%)" }}>{formatDateTime(transfer.requestedAt)}</p>
                                        </div>
                                        <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", gap: "4px" }}>
                                            {cfg.icon} {cfg.label}
                                        </span>
                                    </div>
                                </div>
                                {transfer.notes && (
                                    <p style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "hsl(215,16%,50%)", borderTop: "1px solid hsl(222,47%,18%)", paddingTop: "0.5rem" }}>📝 {transfer.notes}</p>
                                )}
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "3rem", color: "hsl(215,16%,40%)" }}>Tidak ada transfer {filter !== "all" ? statusConfig[filter]?.label : ""}</div>
                    )}
                </div>

                {/* New Transfer Modal */}
                {showNew && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "520px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Buat Transfer Stok Baru</h2>
                                <button onClick={() => setShowNew(false)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={14} /></button>
                            </div>
                            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,13%)" }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)", marginBottom: "4px" }}>Dari Cabang</p>
                                        <p style={{ fontWeight: 600, color: "hsl(213,31%,91%)", fontSize: "0.9rem" }}>{currentBranch?.name}</p>
                                    </div>
                                    <ArrowRight size={16} color="hsl(215,16%,50%)" />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)", marginBottom: "4px" }}>Ke Cabang</p>
                                        <select value={toBranch} onChange={(e) => setToBranch(e.target.value)} style={{ width: "100%", padding: "0.35rem 0.5rem", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" }}>
                                            <option value="">Pilih cabang tujuan</option>
                                            {mockBranches.filter((b) => b.id !== currentBranch?.id && b.isActive).map((b) => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Add Items */}
                                <div>
                                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "hsl(213,31%,80%)", marginBottom: "0.5rem" }}>Produk yang Ditransfer</p>
                                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ flex: 2, padding: "0.45rem 0.5rem", borderRadius: "6px", fontSize: "0.82rem", cursor: "pointer" }}>
                                            <option value="">Pilih produk...</option>
                                            {mockProducts.filter((p) => p.isActive).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ flex: 1, padding: "0.45rem 0.5rem", borderRadius: "6px", fontSize: "0.82rem" }} />
                                        <button onClick={() => { if (selectedProduct) { setFormItems([...formItems, { productId: selectedProduct, qty }]); setSelectedProduct(""); setQty(1); } }} style={{ padding: "0.45rem 0.75rem", borderRadius: "6px", background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", color: "rgb(59,130,246)", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                                            + Add
                                        </button>
                                    </div>
                                    {formItems.map((fi, i) => {
                                        const prod = mockProducts.find((p) => p.id === fi.productId);
                                        return (
                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.75rem", borderRadius: "6px", background: "hsl(222,47%,14%)", marginBottom: "4px", fontSize: "0.82rem" }}>
                                                <span style={{ color: "hsl(213,31%,85%)" }}>{prod?.name}</span>
                                                <span style={{ color: "hsl(215,16%,60%)" }}>x{fi.qty}</span>
                                                <button onClick={() => setFormItems(formItems.filter((_, j) => j !== i))} style={{ border: "none", background: "none", color: "rgb(239,68,68)", cursor: "pointer" }}>✕</button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Catatan</label>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alasan transfer..." style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", height: "72px", resize: "vertical" }} />
                                </div>

                                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                    <button onClick={() => setShowNew(false)} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Batal</button>
                                    <button onClick={handleCreateTransfer} disabled={!toBranch || formItems.length === 0} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: "pointer", opacity: (!toBranch || formItems.length === 0) ? 0.5 : 1 }}>
                                        Kirim Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {showDetail && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "480px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)", marginBottom: "4px" }}>{showDetail.transferNumber}</h2>
                                    <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 600, background: statusConfig[showDetail.status]?.bg, color: statusConfig[showDetail.status]?.color, border: `1px solid ${statusConfig[showDetail.status]?.border}` }}>
                                        {statusConfig[showDetail.status]?.label}
                                    </span>
                                </div>
                                <button onClick={() => setShowDetail(null)} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={14} /></button>
                            </div>
                            <div style={{ padding: "1.25rem 1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,13%)", marginBottom: "1rem" }}>
                                    <div style={{ flex: 1, textAlign: "center" }}>
                                        <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)" }}>Dari</p>
                                        <p style={{ fontWeight: 600, color: "hsl(213,31%,91%)", fontSize: "0.85rem" }}>{showDetail.fromBranchName}</p>
                                    </div>
                                    <ArrowRight size={16} color="hsl(215,16%,50%)" />
                                    <div style={{ flex: 1, textAlign: "center" }}>
                                        <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)" }}>Ke</p>
                                        <p style={{ fontWeight: 600, color: "hsl(213,31%,91%)", fontSize: "0.85rem" }}>{showDetail.toBranchName}</p>
                                    </div>
                                </div>
                                <div style={{ marginBottom: "1rem" }}>
                                    {showDetail.items.map((item) => (
                                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "6px", background: "hsl(222,47%,13%)", marginBottom: "4px", fontSize: "0.85rem" }}>
                                            <span style={{ color: "hsl(213,31%,85%)" }}>{item.productName}</span>
                                            <span style={{ color: "hsl(215,16%,65%)", fontWeight: 500 }}>{item.quantity} {item.unit}</span>
                                        </div>
                                    ))}
                                </div>
                                {showDetail.notes && <p style={{ fontSize: "0.8rem", color: "hsl(215,16%,55%)", marginBottom: "1rem", padding: "0.5rem 0.75rem", background: "hsl(222,47%,13%)", borderRadius: "6px" }}>📝 {showDetail.notes}</p>}
                                <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)", marginBottom: "1rem" }}>Diminta oleh: {showDetail.requestedByName} · {formatDateTime(showDetail.requestedAt)}</p>

                                {/* Action Buttons based on status */}
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {showDetail.status === "pending" && user?.role !== "cashier" && (
                                        <>
                                            <button onClick={() => handleUpdateStatus(showDetail.id, "approved")} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "rgb(34,197,94)", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>✓ Setujui</button>
                                            <button onClick={() => handleUpdateStatus(showDetail.id, "rejected")} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "rgb(239,68,68)", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>✕ Tolak</button>
                                        </>
                                    )}
                                    {showDetail.status === "approved" && (
                                        <button onClick={() => handleUpdateStatus(showDetail.id, "in_transit")} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "rgb(139,92,246)", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>🚚 Kirim Barang</button>
                                    )}
                                    {showDetail.status === "in_transit" && (
                                        <button onClick={() => handleUpdateStatus(showDetail.id, "completed")} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "rgb(34,197,94)", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>✓ Konfirmasi Diterima</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
