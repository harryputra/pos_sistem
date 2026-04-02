"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Transaction, Shift } from "@/lib/types";
import { generateInvoiceNumber } from "@/lib/utils";
import { mockTransactions, mockShifts } from "@/lib/mock-data";

interface POSState {
    cart: CartItem[];
    transactions: Transaction[];
    shifts: Shift[];
    activeShift: Shift | null;
    isOffline: boolean;
    pendingSync: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateDiscount: (productId: string, discount: number, type: "percent" | "nominal") => void;
    clearCart: () => void;
    getCartTotal: () => { subtotal: number; discount: number; tax: number; total: number };
    openShift: (branchId: string, cashierId: string, openingBalance: number) => void;
    closeShift: (closingBalance: number) => void;
    createTransaction: (params: {
        branchId: string;
        cashierId: string;
        cashierName: string;
        branchName: string;
        paymentMethod: "cash" | "card" | "qris" | "transfer" | "split";
        paidAmount: number;
        customerName?: string;
        transactionDiscount?: number;
        taxRate?: number;
    }) => Transaction;
    voidTransaction: (transactionId: string, voidedBy: string) => void;
    setOfflineStatus: (status: boolean) => void;
}

export const usePOSStore = create<POSState>()(
    persist(
        (set, get) => ({
            cart: [],
            transactions: mockTransactions,
            shifts: mockShifts,
            activeShift: mockShifts.find((s) => s.status === "open") || null,
            isOffline: false,
            pendingSync: 0,

            addToCart: (product: Product) => {
                const existing = get().cart.find((i) => i.product.id === product.id);
                if (existing) {
                    set((s) => ({
                        cart: s.cart.map((i) =>
                            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    }));
                } else {
                    set((s) => ({
                        cart: [
                            ...s.cart,
                            {
                                product,
                                quantity: 1,
                                discount: 0,
                                discountType: "percent",
                                price: product.sellingPrice,
                            },
                        ],
                    }));
                }
            },

            removeFromCart: (productId: string) => {
                set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set((s) => ({
                    cart: s.cart.map((i) =>
                        i.product.id === productId ? { ...i, quantity } : i
                    ),
                }));
            },

            updateDiscount: (productId: string, discount: number, type: "percent" | "nominal") => {
                set((s) => ({
                    cart: s.cart.map((i) =>
                        i.product.id === productId ? { ...i, discount, discountType: type } : i
                    ),
                }));
            },

            clearCart: () => set({ cart: [] }),

            getCartTotal: () => {
                const cart = get().cart;
                let subtotal = 0;
                let totalDiscount = 0;
                for (const item of cart) {
                    const itemSubtotal = item.price * item.quantity;
                    const discountAmt =
                        item.discountType === "percent"
                            ? (itemSubtotal * item.discount) / 100
                            : item.discount * item.quantity;
                    subtotal += itemSubtotal;
                    totalDiscount += discountAmt;
                }
                const taxBase = subtotal - totalDiscount;
                const tax = Math.round(taxBase * 0.11);
                return { subtotal, discount: totalDiscount, tax, total: taxBase + tax };
            },

            openShift: (branchId: string, cashierId: string, openingBalance: number) => {
                const shift: Shift = {
                    id: `shift-${Date.now()}`,
                    branchId,
                    cashierId,
                    openingBalance,
                    totalSales: 0,
                    totalTransactions: 0,
                    status: "open",
                    openedAt: new Date().toISOString(),
                };
                set((s) => ({ shifts: [...s.shifts, shift], activeShift: shift }));
            },

            closeShift: (closingBalance: number) => {
                const shift = get().activeShift;
                if (!shift) return;
                const updated = { ...shift, status: "closed" as const, closingBalance, closedAt: new Date().toISOString() };
                set((s) => ({
                    shifts: s.shifts.map((sh) => (sh.id === shift.id ? updated : sh)),
                    activeShift: null,
                }));
            },

            createTransaction: (params) => {
                const { subtotal, discount, tax, total } = get().getCartTotal();
                const cart = get().cart;
                const taxRate = params.taxRate ?? 0.11;
                const actualTax = Math.round((subtotal - discount) * taxRate);

                const transaction: Transaction = {
                    id: `trx-${Date.now()}`,
                    invoiceNumber: generateInvoiceNumber(),
                    branchId: params.branchId,
                    branchName: params.branchName,
                    cashierId: params.cashierId,
                    cashierName: params.cashierName,
                    customerName: params.customerName,
                    subtotal,
                    discountAmount: discount + (params.transactionDiscount || 0),
                    taxAmount: actualTax,
                    totalAmount: total - (params.transactionDiscount || 0),
                    paymentMethod: params.paymentMethod,
                    paidAmount: params.paidAmount,
                    changeAmount: Math.max(0, params.paidAmount - (total - (params.transactionDiscount || 0))),
                    status: "completed",
                    syncStatus: get().isOffline ? "pending" : "synced",
                    items: cart.map((item, idx) => {
                        const itemSubtotal = item.price * item.quantity;
                        const discAmt = item.discountType === "percent" ? (itemSubtotal * item.discount) / 100 : item.discount * item.quantity;
                        return {
                            id: `item-${Date.now()}-${idx}`,
                            transactionId: `trx-${Date.now()}`,
                            productId: item.product.id,
                            productName: item.product.name,
                            sku: item.product.sku,
                            quantity: item.quantity,
                            price: item.price,
                            discountAmount: discAmt,
                            subtotal: itemSubtotal - discAmt,
                        };
                    }),
                    shiftId: get().activeShift?.id,
                    createdAt: new Date().toISOString(),
                };

                set((s) => ({
                    transactions: [transaction, ...s.transactions],
                    pendingSync: get().isOffline ? s.pendingSync + 1 : s.pendingSync,
                }));

                get().clearCart();
                return transaction;
            },

            voidTransaction: (transactionId: string, voidedBy: string) => {
                set((s) => ({
                    transactions: s.transactions.map((t) =>
                        t.id === transactionId
                            ? { ...t, status: "voided" as const, voidedAt: new Date().toISOString(), voidedBy }
                            : t
                    ),
                }));
            },

            setOfflineStatus: (status: boolean) => set({ isOffline: status }),
        }),
        {
            name: "pos-store",
            partialize: (state) => ({
                cart: state.cart,
                transactions: state.transactions,
                shifts: state.shifts,
                activeShift: state.activeShift,
                pendingSync: state.pendingSync,
            }),
        }
    )
);
