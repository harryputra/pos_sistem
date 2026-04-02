"use client";
import Header from "@/components/layout/Header";
import { mockTransactions, mockBranches, mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, DollarSign, Package, ShoppingBag, Download } from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
    const [period, setPeriod] = useState("7days");

    // Calculate stats based on mock data
    const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalTransactions = mockTransactions.length;
    const avgTransaction = totalRevenue / (totalTransactions || 1);
    const totalItemsSold = mockTransactions.reduce((sum, t) => sum + t.items.reduce((iSum, item) => iSum + item.quantity, 0), 0);

    // Revenue by branch for chart
    const branchRevenue = mockBranches.map(branch => {
        const revenue = mockTransactions
            .filter(t => t.branchId === branch.id)
            .reduce((sum, t) => sum + t.totalAmount, 0);
        return { name: branch.name, value: revenue };
    });

    // Top products
    const productSales: Record<string, number> = {};
    mockTransactions.forEach(t => {
        t.items.forEach(item => {
            productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
    });

    const topProducts = Object.entries(productSales)
        .map(([id, qty]) => ({
            product: mockProducts.find(p => p.id === id),
            quantity: qty,
            revenue: qty * (mockProducts.find(p => p.id === id)?.sellingPrice || 0)
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return (
        <div>
            <Header title="Laporan & Analitik" subtitle="Analisa performa bisnis antar cabang" />
            <div className="page-container">
                {/* Filters */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {["Hari Ini", "7 Hari", "30 Hari", "Tahun Ini"].map((p, i) => (
                            <button
                                key={p}
                                className={i === 1 ? "tab-active" : "tab-inactive"}
                                style={{ padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid hsl(222,47%,20%)", background: i === 1 ? "hsla(221,83%,53%,0.1)" : "transparent", color: i === 1 ? "hsl(221,83%,70%)" : "hsl(215,16%,55%)", cursor: "pointer" }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,20%)", color: "hsl(213,31%,91%)", fontSize: "0.85rem", cursor: "pointer" }}>
                        <Download size={16} /> Export PDF/Excel
                    </button>
                </div>

                {/* Summary Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { label: "Total Pendapatan", value: formatCurrency(totalRevenue), icon: <DollarSign size={20} />, color: "rgb(34,197,94)" },
                        { label: "Total Transaksi", value: totalTransactions.toString(), icon: <ShoppingBag size={20} />, color: "rgb(59,130,246)" },
                        { label: "Rata-rata Struk", value: formatCurrency(avgTransaction), icon: <TrendingUp size={20} />, color: "rgb(139,92,246)" },
                        { label: "Produk Terjual", value: totalItemsSold.toString(), icon: <Package size={20} />, color: "rgb(234,179,8)" },
                    ].map((stat, i) => (
                        <div key={i} style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "12px", padding: "1.25rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                <div style={{ padding: "0.5rem", borderRadius: "8px", background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,55%)", marginBottom: "0.25rem" }}>{stat.label}</p>
                            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "hsl(213,31%,91%)" }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                    {/* Revenue by Branch */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "16px", padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>Pendapatan per Cabang</h3>
                            <BarChart3 size={18} color="hsl(215,16%,45%)" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {branchRevenue.map((branch, i) => {
                                const max = Math.max(...branchRevenue.map(b => b.value));
                                const percentage = (branch.value / max) * 100;
                                return (
                                    <div key={i}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                                            <span style={{ color: "hsl(215,16%,65%)" }}>{branch.name}</span>
                                            <span style={{ fontWeight: 600, color: "hsl(213,31%,91%)" }}>{formatCurrency(branch.value)}</span>
                                        </div>
                                        <div style={{ height: "8px", background: "hsl(222,47%,15%)", borderRadius: "4px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${percentage}%`, background: "linear-gradient(90deg, hsl(221,83%,53%), hsl(250,80%,60%))", borderRadius: "4px" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div style={{ background: "hsl(222,47%,10%)", border: "1px solid hsl(222,47%,18%)", borderRadius: "16px", padding: "1.5rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "hsl(213,31%,91%)", marginBottom: "1.5rem" }}>Produk Terlaris</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {topProducts.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: i !== topProducts.length - 1 ? "1px solid hsl(222,47%,15%)" : "none" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "hsl(222,47%,15%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "hsl(215,16%,60%)" }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "hsl(213,31%,91%)" }}>{item.product?.name}</p>
                                        <p style={{ fontSize: "0.75rem", color: "hsl(215,16%,55%)" }}>{item.quantity} terjual</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "rgb(34,197,94)" }}>{formatCurrency(item.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
