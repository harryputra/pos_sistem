"use client";
import { useAuthStore } from "@/lib/store/auth.store";
import { usePOSStore } from "@/lib/store/pos.store";
import Header from "@/components/layout/Header";
import {
    TrendingUp, TrendingDown, ShoppingBag, Building2, Package, AlertTriangle,
    ArrowUpRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getSalesChartData, getBranchSalesData, mockProducts, mockStock, mockBranches } from "@/lib/mock-data";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts";

function MetricCard({ title, value, subtitle, trend, icon, color }: {
    title: string; value: string; subtitle?: string; trend?: number;
    icon: React.ReactNode; color: string;
}) {
    return (
        <div className="card-hover" style={{
            background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)",
            borderRadius: "12px", padding: "1.25rem",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <p style={{ fontSize: "0.78rem", color: "hsl(215,16%,50%)", fontWeight: 500, marginBottom: "0.5rem" }}>{title}</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>{value}</p>
                    {subtitle && <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,55%)", marginTop: "0.25rem" }}>{subtitle}</p>}
                </div>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                </div>
            </div>
            {trend !== undefined && (
                <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    {trend >= 0 ? <TrendingUp size={14} color="rgb(34,197,94)" /> : <TrendingDown size={14} color="rgb(239,68,68)" />}
                    <span style={{ fontSize: "0.75rem", color: trend >= 0 ? "rgb(34,197,94)" : "rgb(239,68,68)", fontWeight: 500 }}>
                        {Math.abs(trend)}%
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "hsl(215,16%,45%)" }}>vs kemarin</span>
                </div>
            )}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "hsl(222,47%,12%)", border: "1px solid hsl(222,47%,22%)", borderRadius: "8px", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,55%)" }}>{label}</p>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgb(59,130,246)" }}>{formatCurrency(payload[0].value)}</p>
                {payload[1] && <p style={{ fontSize: "0.8rem", color: "hsl(213,31%,91%)" }}>{payload[1].value} transaksi</p>}
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const { user, currentBranch } = useAuthStore();
    const { transactions } = usePOSStore();
    const salesData = getSalesChartData();
    const branchData = getBranchSalesData();

    const todayTrx = transactions.filter((t) => t.status === "completed" && t.createdAt.startsWith("2026-04-02"));
    const todayRevenue = todayTrx.reduce((s, t) => s + t.totalAmount, 0);
    const lowStockProducts = mockProducts.filter((p) => {
        const stock = mockStock.find((s) => s.productId === p.id && s.branchId === (currentBranch?.id || "branch-001"));
        return stock && stock.quantity <= p.minStock;
    });

    return (
        <div>
            <Header title={`Selamat datang, ${user?.fullName?.split(" ")[0]}! 👋`} subtitle={`Dashboard ${currentBranch?.name || "Semua Cabang"} — Hari ini, 2 April 2026`} />
            <div className="page-container">
                {/* Metric Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    <MetricCard title="Pendapatan Hari Ini" value={formatCurrency(todayRevenue)} subtitle={`${todayTrx.length} transaksi`} trend={12.5} icon={<TrendingUp size={20} color="rgb(59,130,246)" />} color="rgba(59,130,246,0.15)" />
                    <MetricCard title="Total Transaksi" value={String(todayTrx.length)} subtitle="Semua cabang" trend={-3.2} icon={<ShoppingBag size={20} color="rgb(139,92,246)" />} color="rgba(139,92,246,0.15)" />
                    <MetricCard title="Total Cabang Aktif" value={String(mockBranches.filter((b) => b.isActive).length)} subtitle={`dari ${mockBranches.length} cabang`} icon={<Building2 size={20} color="rgb(34,197,94)" />} color="rgba(34,197,94,0.15)" />
                    <MetricCard title="Total Produk" value={String(mockProducts.filter((p) => p.isActive).length)} subtitle="Produk aktif" icon={<Package size={20} color="rgb(234,179,8)" />} color="rgba(234,179,8,0.15)" />
                </div>

                {/* Charts Row */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    {/* Sales Chart */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <div>
                                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>Tren Penjualan 7 Hari</h3>
                                <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)" }}>Semua cabang</p>
                            </div>
                            <span style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "6px", background: "rgba(59,130,246,0.1)", color: "rgb(59,130,246)", border: "1px solid rgba(59,130,246,0.3)", fontWeight: 500 }}>7 Hari</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(221,83%,53%)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(221,83%,53%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,47%,18%)" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215,16%,50%)" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(215,16%,50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(221,83%,53%)" fill="url(#colorRevenue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Branch Sales */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.25rem" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "hsl(213,31%,91%)", marginBottom: "0.25rem" }}>Penjualan per Cabang</h3>
                        <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,50%)", marginBottom: "1rem" }}>Hari ini</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={branchData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,47%,18%)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215,16%,50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                                <YAxis type="category" dataKey="branch" tick={{ fontSize: 11, fill: "hsl(215,16%,55%)" }} axisLine={false} tickLine={false} width={70} />
                                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(222,47%,12%)", border: "1px solid hsl(222,47%,22%)", borderRadius: "8px" }} labelStyle={{ color: "hsl(213,31%,91%)" }} />
                                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                    {branchData.map((_, i) => <Cell key={i} fill={`hsl(${221 + i * 15},83%,${53 + i * 3}%)`} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {/* Recent Transactions */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>Transaksi Terbaru</h3>
                            <a href="/transactions" style={{ fontSize: "0.75rem", color: "rgb(59,130,246)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                                Lihat semua <ArrowUpRight size={12} />
                            </a>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {todayTrx.slice(0, 5).map((t) => (
                                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.75rem", borderRadius: "8px", background: "hsl(222,47%,13%)", border: "1px solid hsl(222,47%,20%)" }}>
                                    <div>
                                        <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "hsl(213,31%,85%)" }}>{t.invoiceNumber}</p>
                                        <p style={{ fontSize: "0.72rem", color: "hsl(215,16%,50%)" }}>{t.cashierName} · {t.branchName}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{formatCurrency(t.totalAmount)}</p>
                                        <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: t.paymentMethod === "cash" ? "rgba(34,197,94,0.15)" : t.paymentMethod === "qris" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)", color: t.paymentMethod === "cash" ? "rgb(34,197,94)" : t.paymentMethod === "qris" ? "rgb(139,92,246)" : "rgb(59,130,246)" }}>
                                            {t.paymentMethod === "cash" ? "Tunai" : t.paymentMethod === "qris" ? "QRIS" : t.paymentMethod === "card" ? "Kartu" : "Transfer"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>Alert Stok Menipis</h3>
                            <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)", border: "1px solid rgba(239,68,68,0.3)", fontWeight: 600 }}>
                                {lowStockProducts.length} produk
                            </span>
                        </div>
                        {lowStockProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "2rem", color: "hsl(215,16%,45%)", fontSize: "0.85rem" }}>
                                ✅ Semua stok aman
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {lowStockProducts.slice(0, 5).map((p) => {
                                    const stock = mockStock.find((s) => s.productId === p.id && s.branchId === (currentBranch?.id || "branch-001"));
                                    const qty = stock?.quantity || 0;
                                    const isOut = qty === 0;
                                    return (
                                        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.75rem", borderRadius: "8px", background: isOut ? "rgba(239,68,68,0.05)" : "rgba(234,179,8,0.05)", border: `1px solid ${isOut ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)"}` }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <AlertTriangle size={14} color={isOut ? "rgb(239,68,68)" : "rgb(234,179,8)"} />
                                                <div>
                                                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "hsl(213,31%,85%)" }}>{p.name}</p>
                                                    <p style={{ fontSize: "0.7rem", color: "hsl(215,16%,50%)" }}>Min: {p.minStock} {p.unit}</p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isOut ? "rgb(239,68,68)" : "rgb(234,179,8)" }}>
                                                {qty} {p.unit}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
