"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockProducts, mockBranches } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store/auth.store";
import { formatCurrency } from "@/lib/utils";
import { Truck, Plus, X } from "lucide-react";

export default function StockInPage() {
    const { user, currentBranch } = useAuthStore();
    const [items, setItems] = useState<{ productId: string; qty: number; purchasePrice: number }[]>([]);
    const [supplier, setSupplier] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const addItem = () => setItems([...items, { productId: "", qty: 1, purchasePrice: 0 }]);
    const removeItem = (i: number) => setItems(items.filter((_, j) => j !== i));
    const updateItem = (i: number, field: string, val: string | number) => {
        setItems(items.map((item, j) => j === i ? { ...item, [field]: val } : item));
    };

    const totalValue = items.reduce((sum, item) => {
        const prod = mockProducts.find((p) => p.id === item.productId);
        const price = item.purchasePrice || prod?.purchasePrice || 0;
        return sum + price * item.qty;
    }, 0);

    const handleSubmit = () => {
        if (items.length === 0) return;
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setItems([]); setSupplier(""); setNotes(""); }, 2000);
    };

    return (
        <div>
            <Header title="Stok Masuk" subtitle="Catat penerimaan stok dari supplier" />
            <div className="page-container" style={{ maxWidth: "800px" }}>
                {submitted && (
                    <div style={{ marginBottom: "1rem", padding: "0.875rem 1rem", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "rgb(34,197,94)", fontWeight: 500, textAlign: "center" }}>
                        ✅ Stok masuk berhasil dicatat!
                    </div>
                )}

                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
                    <h3 style={{ fontWeight: 600, marginBottom: "1rem", color: "hsl(213,31%,91%)" }}>Informasi Penerimaan</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Cabang Penerima</label>
                            <input type="text" value={currentBranch?.name || ""} readOnly style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", opacity: 0.7 }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Nama Supplier</label>
                            <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g. PT Sumber Makmur" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem" }} />
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "hsl(215,16%,60%)", marginBottom: "0.35rem" }}>Catatan</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Nomor PO, keterangan, dll..." style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", height: "60px", resize: "vertical" }} />
                        </div>
                    </div>
                </div>

                <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ fontWeight: 600, color: "hsl(213,31%,91%)" }}>Daftar Produk</h3>
                        <button onClick={addItem} style={{ padding: "0.4rem 0.75rem", borderRadius: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "rgb(59,130,246)", cursor: "pointer", fontWeight: 500, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Plus size={14} /> Tambah Produk
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem", color: "hsl(215,16%,40%)", fontSize: "0.85rem" }}>
                            <Truck size={32} style={{ marginBottom: "0.5rem", opacity: 0.3 }} />
                            <p>Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.5rem", padding: "0.35rem 0.75rem" }}>
                                {["Produk", "Qty", "Harga Beli (Rp)", ""].map((h) => (
                                    <span key={h} style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)", textTransform: "uppercase", fontWeight: 600 }}>{h}</span>
                                ))}
                            </div>
                            {items.map((item, i) => (
                                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.5rem", alignItems: "center", padding: "0.5rem 0.75rem", borderRadius: "8px", background: "hsl(222,47%,13%)" }}>
                                    <select value={item.productId} onChange={(e) => {
                                        const prod = mockProducts.find((p) => p.id === e.target.value);
                                        updateItem(i, "productId", e.target.value);
                                        if (prod) updateItem(i, "purchasePrice", prod.purchasePrice);
                                    }} style={{ padding: "0.4rem 0.5rem", borderRadius: "6px", fontSize: "0.82rem", cursor: "pointer" }}>
                                        <option value="">Pilih produk...</option>
                                        {mockProducts.filter((p) => p.isActive).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    <input type="number" min={1} value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} style={{ padding: "0.4rem 0.5rem", borderRadius: "6px", fontSize: "0.82rem" }} />
                                    <input type="number" min={0} value={item.purchasePrice} onChange={(e) => updateItem(i, "purchasePrice", Number(e.target.value))} style={{ padding: "0.4rem 0.5rem", borderRadius: "6px", fontSize: "0.82rem" }} />
                                    <button onClick={() => removeItem(i)} style={{ padding: "5px", borderRadius: "5px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={12} /></button>
                                </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "flex-end", padding: "0.5rem 0.75rem", borderTop: "1px solid hsl(222,47%,18%)", marginTop: "0.5rem" }}>
                                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>Total Nilai: {formatCurrency(totalValue)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button onClick={() => setItems([])} style={{ padding: "0.625rem 1.25rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer" }}>Reset</button>
                    <button onClick={handleSubmit} disabled={items.length === 0} style={{ padding: "0.625rem 1.5rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 600, cursor: items.length === 0 ? "not-allowed" : "pointer", opacity: items.length === 0 ? 0.5 : 1 }}>
                        Simpan Stok Masuk
                    </button>
                </div>
            </div>
        </div>
    );
}
