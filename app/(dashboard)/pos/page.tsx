"use client";
import { useState, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { usePOSStore } from "@/lib/store/pos.store";
import Header from "@/components/layout/Header";
import { mockProducts, mockStock } from "@/lib/mock-data";
import { Product, CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
    Search, Plus, Minus, Trash2, ShoppingCart, Barcode, Tag,
    CreditCard, Banknote, QrCode, Repeat, X, CheckCircle2,
    Printer, Receipt, AlertCircle, SplitSquareHorizontal
} from "lucide-react";

function PaymentModal({
    total, onClose, onConfirm
}: {
    total: number;
    onClose: () => void;
    onConfirm: (method: "cash" | "card" | "qris" | "transfer" | "split", paid: number, customer?: string) => void;
}) {
    const [method, setMethod] = useState<"cash" | "card" | "qris" | "transfer">("cash");
    const [paid, setPaid] = useState(total);
    const [customer, setCustomer] = useState("");

    const methods = [
        { id: "cash", label: "Tunai", icon: <Banknote size={18} /> },
        { id: "card", label: "Kartu", icon: <CreditCard size={18} /> },
        { id: "qris", label: "QRIS", icon: <QrCode size={18} /> },
        { id: "transfer", label: "Transfer", icon: <Repeat size={18} /> },
    ];

    const change = Math.max(0, paid - total);
    const canConfirm = paid >= total;

    const quickAmounts = [total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "480px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>Proses Pembayaran</h2>
                    <button onClick={onClose} style={{ padding: "4px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", border: "none", color: "rgb(239,68,68)", cursor: "pointer" }}><X size={16} /></button>
                </div>
                <div style={{ padding: "1.5rem" }}>
                    {/* Total */}
                    <div style={{ textAlign: "center", marginBottom: "1.5rem", padding: "1rem", borderRadius: "12px", background: "hsl(222,47%,13%)" }}>
                        <p style={{ fontSize: "0.8rem", color: "hsl(215,16%,50%)", marginBottom: "4px" }}>Total Pembayaran</p>
                        <p style={{ fontSize: "2rem", fontWeight: 800, color: "hsl(213,31%,91%)" }}>{formatCurrency(total)}</p>
                    </div>

                    {/* Payment Methods */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        {methods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { setMethod(m.id as any); if (m.id !== "cash") setPaid(total); }}
                                style={{ padding: "0.625rem", borderRadius: "10px", border: `2px solid ${method === m.id ? "hsl(221,83%,53%)" : "hsl(222,47%,22%)"}`, background: method === m.id ? "rgba(59,130,246,0.1)" : "hsl(222,47%,14%)", color: method === m.id ? "rgb(59,130,246)" : "hsl(215,16%,65%)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", transition: "all 0.15s" }}
                            >
                                {m.icon}
                                <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>{m.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* QRIS Display */}
                    {method === "qris" && (
                        <div style={{ textAlign: "center", marginBottom: "1rem", padding: "1rem", borderRadius: "10px", background: "white" }}>
                            <div style={{ width: "140px", height: "140px", margin: "0 auto", background: "repeating-linear-gradient(0deg, #000 0, #000 2px, white 0, white 6px), repeating-linear-gradient(90deg, #000 0, #000 2px, white 0, white 6px)", backgroundSize: "8px 8px", borderRadius: "8px" }} />
                            <p style={{ fontSize: "0.75rem", color: "#333", marginTop: "0.5rem", fontWeight: 500 }}>Scan QR Code untuk membayar</p>
                        </div>
                    )}

                    {/* Cash Input */}
                    {method === "cash" && (
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ fontSize: "0.8rem", color: "hsl(215,16%,60%)", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>Nominal Bayar</label>
                            <input
                                type="text"
                                value={paid.toLocaleString("id-ID")}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setPaid(Number(val) || 0);
                                }}
                                style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", fontSize: "1rem", fontWeight: 600 }}
                            />
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                {quickAmounts.map((a) => (
                                    <button key={a} onClick={() => setPaid(a)} style={{ flex: 1, padding: "0.375rem", fontSize: "0.72rem", borderRadius: "6px", border: "1px solid hsl(222,47%,25%)", background: paid === a ? "rgba(59,130,246,0.15)" : "hsl(222,47%,14%)", color: paid === a ? "rgb(59,130,246)" : "hsl(215,16%,65%)", cursor: "pointer", fontWeight: 500 }}>
                                        {formatCurrency(a)}
                                    </button>
                                ))}
                            </div>
                            {paid >= total && (
                                <div style={{ marginTop: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "0.85rem", color: "rgb(34,197,94)", fontWeight: 500 }}>Kembalian</span>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgb(34,197,94)" }}>{formatCurrency(change)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Customer Name */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <input
                            type="text"
                            placeholder="Nama pelanggan (opsional)"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}
                        />
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={() => canConfirm && onConfirm(method, paid, customer || undefined)}
                        disabled={!canConfirm && method === "cash"}
                        style={{
                            width: "100%", padding: "0.875rem", borderRadius: "10px",
                            background: canConfirm || method !== "cash" ? "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))" : "hsl(222,47%,20%)",
                            color: "white", fontWeight: 700, fontSize: "1rem", border: "none",
                            cursor: canConfirm || method !== "cash" ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        }}
                    >
                        <CheckCircle2 size={18} />
                        {method === "cash" ? `Selesaikan Transaksi${canConfirm ? ` (Kembali ${formatCurrency(change)})` : ""}` : "Konfirmasi Pembayaran"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReceiptModal({ transaction, onClose }: { transaction: any; onClose: () => void }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", borderRadius: "16px", width: "100%", maxWidth: "380px" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid hsl(222,47%,18%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "hsl(213,31%,91%)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CheckCircle2 size={18} color="rgb(34,197,94)" /> Transaksi Berhasil!
                    </h2>
                    <button onClick={onClose} style={{ padding: "4px", borderRadius: "6px", border: "none", background: "hsl(222,47%,18%)", color: "hsl(215,16%,65%)", cursor: "pointer" }}><X size={14} /></button>
                </div>
                <div style={{ padding: "1rem 1.5rem" }}>
                    <style>{`
                        @media print {
                            body * { visibility: hidden; }
                            #printable-receipt, #printable-receipt * { visibility: visible; }
                            #printable-receipt { 
                                position: fixed; 
                                left: 0; top: 0; 
                                width: 80mm; 
                                background: white !important;
                                padding: 5mm;
                                color: black !important;
                                font-family: monospace;
                                font-size: 10pt;
                            }
                            #printable-receipt p { margin-bottom: 2px; }
                        }
                    `}</style>
                    {/* Receipt Preview */}
                    <div id="printable-receipt" style={{ background: "white", color: "#222", borderRadius: "8px", padding: "1rem", fontFamily: "monospace", fontSize: "0.78rem", marginBottom: "1rem" }}>
                        <p style={{ textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>TOKO SEJAHTERA GROUP</p>
                        <p style={{ textAlign: "center", color: "#555", marginBottom: "8px" }}>Cabang Sudirman</p>
                        <p style={{ borderTop: "1px dashed #ccc", paddingTop: "6px" }}>No: {transaction.invoiceNumber}</p>
                        <p>Kasir: {transaction.cashierName}</p>
                        <p style={{ borderBottom: "1px dashed #ccc", paddingBottom: "6px" }}>Tanggal: {new Date().toLocaleString("id-ID")}</p>
                        <div style={{ paddingTop: "6px" }}>
                            {transaction.items?.map((item: any) => (
                                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                                    <span>{item.productName} x{item.quantity}</span>
                                    <span>{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: "1px dashed #ccc", marginTop: "6px", paddingTop: "6px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatCurrency(transaction.subtotal)}</span></div>
                            {transaction.discountAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Diskon</span><span>-{formatCurrency(transaction.discountAmount)}</span></div>}
                            <div style={{ display: "flex", justifyContent: "space-between" }}><span>PPN 11%</span><span>{formatCurrency(transaction.taxAmount)}</span></div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.9rem" }}><span>TOTAL</span><span>{formatCurrency(transaction.totalAmount)}</span></div>
                            {transaction.paymentMethod === "cash" && <>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bayar</span><span>{formatCurrency(transaction.paidAmount)}</span></div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Kembali</span><span>{formatCurrency(transaction.changeAmount)}</span></div>
                            </>}
                        </div>
                        <p style={{ textAlign: "center", marginTop: "8px", color: "#555" }}>— Terima Kasih —</p>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            onClick={() => window.print()}
                            style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,15%)", color: "hsl(215,16%,75%)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 500 }}
                        >
                            <Printer size={14} /> Cetak
                        </button>
                        <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                            Transaksi Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function POSPage() {
    const { user, currentBranch } = useAuthStore();
    const { cart, addToCart, removeFromCart, updateQuantity, updateDiscount, clearCart, getCartTotal, createTransaction, activeShift } = usePOSStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showPayment, setShowPayment] = useState(false);
    const [completedTrx, setCompletedTrx] = useState<any>(null);
    const [note, setNote] = useState("");
    const [transactionDiscount, setTransactionDiscount] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);

    const branchProducts = mockProducts.filter((p) => {
        if (!p.isActive) return false;
        if (p.type === "local" && p.branchId !== currentBranch?.id) return false;
        return true;
    });

    const categories = ["all", ...Array.from(new Set(branchProducts.map((p) => p.categoryName || "Lainnya")))];

    const filtered = branchProducts.filter((p) => {
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode?.includes(searchQuery);
        const matchCat = selectedCategory === "all" || p.categoryName === selectedCategory;
        return matchSearch && matchCat;
    });

    const getStockForProduct = (productId: string) => {
        const stk = mockStock.find((s) => s.productId === productId && s.branchId === currentBranch?.id);
        return stk?.quantity || 0;
    };

    const { subtotal, discount, tax, total } = getCartTotal();
    const finalTotal = total - transactionDiscount;

    const handleConfirmPayment = (method: "cash" | "card" | "qris" | "transfer" | "split", paid: number, customer?: string) => {
        if (!user || !currentBranch) return;
        const trx = createTransaction({
            branchId: currentBranch.id,
            branchName: currentBranch.name,
            cashierId: user.id,
            cashierName: user.fullName,
            paymentMethod: method,
            paidAmount: paid,
            customerName: customer,
            transactionDiscount,
            taxRate: (currentBranch.taxRate || 11) / 100,
        });
        setShowPayment(false);
        setCompletedTrx(trx);
        setTransactionDiscount(0);
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Header title="Kasir / POS" subtitle={currentBranch?.name} />

            {!activeShift && (
                <div style={{ padding: "0.75rem 1.5rem", background: "rgba(234,179,8,0.1)", borderBottom: "1px solid rgba(234,179,8,0.3)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertCircle size={16} color="rgb(234,179,8)" />
                    <span style={{ fontSize: "0.85rem", color: "rgb(234,179,8)" }}>Shift belum dibuka. Silakan buka shift terlebih dahulu.</span>
                    <a href="/shifts" style={{ marginLeft: "auto", fontSize: "0.8rem", color: "rgb(59,130,246)", fontWeight: 500, textDecoration: "none" }}>Buka Shift →</a>
                </div>
            )}

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", overflow: "hidden" }}>
                {/* Product Panel */}
                <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid hsl(222,47%,15%)" }}>
                    {/* Search */}
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid hsl(222,47%,15%)", display: "flex", gap: "0.5rem" }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "hsl(215,16%,45%)" }} />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Cari produk, SKU, atau scan barcode..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2rem", borderRadius: "8px", fontSize: "0.85rem" }}
                                autoFocus
                            />
                        </div>
                        <button style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid hsl(222,47%,22%)", background: "hsl(222,47%,14%)", color: "hsl(215,16%,65%)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}>
                            <Barcode size={14} /> Barcode
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div style={{ padding: "0.5rem 1rem", borderBottom: "1px solid hsl(222,47%,15%)", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{ padding: "0.3rem 0.75rem", borderRadius: "20px", border: `1px solid ${selectedCategory === cat ? "hsl(221,83%,53%)" : "hsl(222,47%,22%)"}`, background: selectedCategory === cat ? "rgba(59,130,246,0.1)" : "hsl(222,47%,14%)", color: selectedCategory === cat ? "rgb(59,130,246)" : "hsl(215,16%,65%)", cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap", fontWeight: selectedCategory === cat ? 600 : 400, transition: "all 0.15s" }}
                            >
                                {cat === "all" ? "Semua" : cat}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div style={{ flex: 1, overflow: "auto", padding: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem", alignContent: "start" }}>
                        {filtered.map((product) => {
                            const stockQty = getStockForProduct(product.id);
                            const inCart = cart.find((c) => c.product.id === product.id);
                            const isOutOfStock = stockQty <= 0;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => !isOutOfStock && addToCart(product)}
                                    disabled={isOutOfStock}
                                    style={{
                                        padding: "0.75rem", borderRadius: "10px",
                                        background: inCart ? "rgba(59,130,246,0.1)" : "hsl(222,47%,12%)",
                                        border: `1px solid ${inCart ? "hsl(221,83%,53%)" : "hsl(222,47%,20%)"}`,
                                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                                        opacity: isOutOfStock ? 0.5 : 1,
                                        textAlign: "left", transition: "all 0.15s", position: "relative",
                                    }}
                                >
                                    {inCart && (
                                        <span style={{ position: "absolute", top: "6px", right: "6px", width: "20px", height: "20px", borderRadius: "50%", background: "hsl(221,83%,53%)", color: "white", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {inCart.quantity}
                                        </span>
                                    )}
                                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "hsl(222,47%,18%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                                        <Tag size={16} color="hsl(215,16%,55%)" />
                                    </div>
                                    <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "hsl(213,31%,91%)", marginBottom: "0.25rem", lineHeight: 1.3 }}>{product.name}</p>
                                    <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)" }}>{product.sku}</p>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgb(59,130,246)", marginTop: "0.35rem" }}>{formatCurrency(product.sellingPrice)}</p>
                                    <p style={{ fontSize: "0.68rem", color: stockQty <= 5 ? "rgb(239,68,68)" : "hsl(215,16%,45%)", marginTop: "2px" }}>
                                        Stok: {stockQty} {product.unit}
                                    </p>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "hsl(215,16%,45%)" }}>
                                <Search size={32} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                                <p>Produk tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Panel */}
                <div style={{ display: "flex", flexDirection: "column", background: "hsl(222,47%,9%)", overflow: "hidden" }}>
                    {/* Cart Header */}
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid hsl(222,47%,15%)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <ShoppingCart size={16} color="rgb(59,130,246)" />
                            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Keranjang</span>
                            <span style={{ fontSize: "0.75rem", padding: "1px 8px", borderRadius: "9999px", background: "rgba(59,130,246,0.15)", color: "rgb(59,130,246)", fontWeight: 600 }}>
                                {cart.length} item
                            </span>
                        </div>
                        {cart.length > 0 && (
                            <button onClick={() => clearCart()} style={{ fontSize: "0.75rem", color: "rgb(239,68,68)", background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}>
                                Kosongkan
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div style={{ flex: 1, overflow: "auto", padding: "0.5rem" }}>
                        {cart.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "hsl(215,16%,40%)" }}>
                                <ShoppingCart size={40} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
                                <p style={{ fontSize: "0.85rem" }}>Keranjang kosong</p>
                                <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>Pilih produk untuk menambahkan</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product.id} style={{ padding: "0.75rem", borderRadius: "10px", background: "hsl(222,47%,12%)", border: "1px solid hsl(222,47%,20%)", marginBottom: "0.5rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                        <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                                            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "hsl(213,31%,91%)", lineHeight: 1.3 }}>{item.product.name}</p>
                                            <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{formatCurrency(item.price)} / {item.product.unit}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product.id)} style={{ padding: "4px", borderRadius: "4px", border: "none", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", cursor: "pointer", flexShrink: 0 }}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    {/* Qty Controls */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,18%)", color: "hsl(213,31%,91%)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Minus size={12} />
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                            style={{ width: "48px", textAlign: "center", padding: "0.25rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}
                                        />
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1px solid hsl(222,47%,25%)", background: "hsl(222,47%,18%)", color: "hsl(213,31%,91%)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Plus size={12} />
                                        </button>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgb(59,130,246)", marginLeft: "auto" }}>
                                            {formatCurrency(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary */}
                    {cart.length > 0 && (
                        <div style={{ borderTop: "1px solid hsl(222,47%,18%)", padding: "0.75rem 1rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "hsl(215,16%,65%)" }}>
                                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "rgb(34,197,94)" }}>
                                        <span>Diskon Item</span><span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                {transactionDiscount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "rgb(34,197,94)" }}>
                                        <span>Diskon Transaksi</span><span>-{formatCurrency(transactionDiscount)}</span>
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "hsl(215,16%,65%)" }}>
                                    <span>PPN 11%</span><span>{formatCurrency(tax)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700, color: "hsl(213,31%,91%)", borderTop: "1px solid hsl(222,47%,22%)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                                    <span>TOTAL</span><span style={{ color: "rgb(59,130,246)" }}>{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Transaction Discount */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                <input
                                    type="number"
                                    placeholder="Diskon transaksi..."
                                    value={transactionDiscount || ""}
                                    onChange={(e) => setTransactionDiscount(Number(e.target.value) || 0)}
                                    style={{ flex: 1, padding: "0.4rem 0.5rem", borderRadius: "6px", fontSize: "0.8rem" }}
                                />
                                <span style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>Rp</span>
                            </div>

                            <button
                                onClick={() => setShowPayment(true)}
                                style={{ width: "100%", padding: "0.875rem", borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(250,80%,60%))", border: "none", color: "white", fontWeight: 700, fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                            >
                                <CreditCard size={18} /> Bayar {formatCurrency(finalTotal)}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    total={finalTotal}
                    onClose={() => setShowPayment(false)}
                    onConfirm={handleConfirmPayment}
                />
            )}
            {completedTrx && (
                <ReceiptModal
                    transaction={completedTrx}
                    onClose={() => setCompletedTrx(null)}
                />
            )}
        </div>
    );
}
