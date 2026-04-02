"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { usePOSStore } from "@/lib/store/pos.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Clock, Play, Square, DollarSign } from "lucide-react";

export default function ShiftsPage() {
    const { user, currentBranch } = useAuthStore();
    const { activeShift, shifts, openShift, closeShift, transactions, resolveShiftDifference } = usePOSStore();
    const [openingBalance, setOpeningBalance] = useState(500000);
    const [closingBalance, setClosingBalance] = useState(0);
    const [actualCash, setActualCash] = useState(0);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedShift, setSelectedShift] = useState<any>(null);
    const [resolutionNotes, setResolutionNotes] = useState("");

    const shiftTransactions = activeShift
        ? transactions.filter((t) => t.shiftId === activeShift.id && t.status === "completed")
        : [];
    const shiftTotal = shiftTransactions.reduce((s, t) => s + t.totalAmount, 0);

    const handleOpenShift = () => {
        if (user && currentBranch) {
            openShift(currentBranch.id, user.id, openingBalance);
        }
    };

    const handleCloseShift = () => {
        closeShift(actualCash, shiftTotal);
        setShowCloseModal(false);
        setActualCash(0);
    };

    const handleResolveShift = () => {
        if (selectedShift && user) {
            resolveShiftDifference(selectedShift.id, resolutionNotes, user.id, user.fullName);
            setShowResolveModal(false);
            setResolutionNotes("");
            setSelectedShift(null);
        }
    };

    return (
        <div>
            <Header title="Shift Kasir" subtitle="Kelola shift kerja kasir" />
            <div className="page-container" style={{ maxWidth: "800px" }}>
                {/* Active Shift Card */}
                {activeShift ? (
                    <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgb(34,197,94)" }} className="animate-pulse" />
                                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "hsl(213,31%,91%)" }}>Shift Aktif</span>
                                </div>
                                <p style={{ fontSize: "0.82rem", color: "hsl(215,16%,55%)" }}>Dibuka: {formatDateTime(activeShift.openedAt)}</p>
                                <p style={{ fontSize: "0.82rem", color: "hsl(215,16%,55%)" }}>ID Shift: {activeShift.id}</p>
                            </div>
                            <button onClick={() => setShowCloseModal(true)} style={{ padding: "0.625rem 1rem", borderRadius: "10px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "rgb(239,68,68)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                                <Square size={14} /> Tutup Shift
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                            {[
                                { label: "Modal Awal", value: formatCurrency(activeShift.openingBalance), color: "rgb(59,130,246)" },
                                { label: "Total Penjualan", value: formatCurrency(shiftTotal), color: "rgb(34,197,94)" },
                                { label: "Kas Seharusnya", value: formatCurrency(activeShift.openingBalance + activeShift.expectedCash), color: "rgb(234,179,8)" },
                                { label: "Transaksi", value: String(shiftTransactions.length), color: "rgb(139,92,246)" },
                            ].map((s) => (
                                <div key={s.label} style={{ padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)" }}>
                                    <p style={{ fontSize: "0.65rem", color: "hsl(215,16%,50%)", marginBottom: "4px" }}>{s.label}</p>
                                    <p style={{ fontSize: "1rem", fontWeight: 700, color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontWeight: 600, fontSize: "1rem", color: "hsl(213,31%,91%)", marginBottom: "0.25rem" }}>Buka Shift Baru</h3>
                        <p style={{ fontSize: "0.82rem", color: "hsl(215,16%,55%)", marginBottom: "1.25rem" }}>Tidak ada shift aktif. Buka shift untuk mulai transaksi.</p>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Modal Awal (Rp)</label>
                                <input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(Number(e.target.value))} style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 600 }} />
                            </div>
                            <button onClick={handleOpenShift} style={{ padding: "0.625rem 1.5rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                                <Play size={16} /> Buka Shift
                            </button>
                        </div>
                    </div>
                )}

                {/* Shift History */}
                <h3 style={{ fontWeight: 600, color: "hsl(213,31%,91%)", marginBottom: "0.75rem" }}>Riwayat Shift</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {shifts.filter((s) => s.status === "closed").sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime()).map((shift) => (
                        <div key={shift.id} style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(213,31%,85%)" }}>Shift {shift.id.split('-').pop()}</p>
                                    <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>
                                        Kasir: {shift.cashierName} • {formatDateTime(shift.openedAt)} → {shift.closedAt ? formatDateTime(shift.closedAt) : "-"}
                                    </p>
                                    {shift.difference !== 0 && (
                                        <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ fontSize: "0.72rem", color: shift.difference! > 0 ? "rgb(34,197,94)" : "rgb(239,68,68)", fontWeight: 600 }}>
                                                Selisih: {formatCurrency(shift.difference!)}
                                            </span>
                                            <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: shift.resolutionStatus === "resolved" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", color: shift.resolutionStatus === "resolved" ? "rgb(34,197,94)" : "rgb(234,179,8)" }}>
                                                {shift.resolutionStatus === "resolved" ? "Terselesaikan" : "Butuh Resolusi"}
                                            </span>
                                        </div>
                                    )}
                                    {shift.resolutionNotes && (
                                        <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,45%)", marginTop: "0.25rem", fontStyle: "italic" }}>
                                            Resolusi: {shift.resolutionNotes} ({shift.resolvedByName})
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>{formatCurrency(shift.closingBalance || 0)}</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end" }}>
                                        {shift.difference !== 0 && shift.resolutionStatus === "pending" && (user?.role === "admin" || user?.role === "owner") && (
                                            <button
                                                onClick={() => { setSelectedShift(shift); setShowResolveModal(true); }}
                                                style={{ fontSize: "0.7rem", padding: "4px 8px", borderRadius: "6px", background: "hsl(221,83%,53%)", border: "none", color: "white", cursor: "pointer", fontWeight: 600 }}
                                            >
                                                Selesaikan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Close Shift Modal */}
                {showCloseModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "420px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Tutup Shift</h2>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <div style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,13%)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.85rem" }}>
                                        <span style={{ color: "hsl(215,16%,55%)" }}>Modal Awal</span>
                                        <span style={{ fontWeight: 600, color: "hsl(213,31%,85%)" }}>{formatCurrency(activeShift?.openingBalance || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                                        <span style={{ color: "hsl(215,16%,55%)" }}>Uang Tunai Masuk</span>
                                        <span style={{ fontWeight: 600, color: "rgb(34,197,94)" }}>{formatCurrency(activeShift?.expectedCash || 0)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "4px", borderTop: "1px solid hsl(222,47%,20%)", paddingTop: "4px" }}>
                                        <span style={{ color: "hsl(215,16%,55%)" }}>Kas Seharusnya</span>
                                        <span style={{ fontWeight: 700, color: "rgb(234,179,8)" }}>{formatCurrency((activeShift?.openingBalance || 0) + (activeShift?.expectedCash || 0))}</span>
                                    </div>
                                </div>
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Setoran Tunai Fisik (Rp)</label>
                                    <input type="number" value={actualCash} onChange={(e) => setActualCash(Number(e.target.value))} style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700 }} />
                                    {actualCash > 0 && (
                                        <p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: actualCash === (activeShift?.openingBalance || 0) + (activeShift?.expectedCash || 0) ? "rgb(34,197,94)" : "rgb(239,68,68)" }}>
                                            Selisih: {formatCurrency(actualCash - (activeShift?.openingBalance || 0) - (activeShift?.expectedCash || 0))}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button onClick={() => setShowCloseModal(false)} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Batal</button>
                                    <button onClick={handleCloseShift} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "rgb(239,68,68)", fontWeight: 600, cursor: "pointer" }}>Tutup Shift</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resolution Modal */}
                {showResolveModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                        <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "420px" }}>
                            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)" }}>
                                <h2 style={{ fontWeight: 700, color: "hsl(213,31%,91%)" }}>Selesaikan Selisih Kas</h2>
                            </div>
                            <div style={{ padding: "1.5rem" }}>
                                <div style={{ marginBottom: "1rem", padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,13%)" }}>
                                    <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,55%)" }}>Selisih</p>
                                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: selectedShift?.difference! > 0 ? "rgb(34,197,94)" : "rgb(239,68,68)" }}>
                                        {formatCurrency(selectedShift?.difference || 0)}
                                    </p>
                                </div>
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Catatan Penyelesaian</label>
                                    <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        placeholder="Contoh: Dipotong gaji, Diterima sebagai kerugian, dll."
                                        style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "8px", fontSize: "0.9rem", minHeight: "80px", background: "hsl(222,47%,7%)", border: "1px solid hsl(222,47%,20%)", color: "white" }}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button onClick={() => setShowResolveModal(false)} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Batal</button>
                                    <button onClick={handleResolveShift} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "hsl(221,83%,53%)", border: "none", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Resolusi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
