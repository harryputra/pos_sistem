export type UserRole = "owner" | "admin" | "cashier" | "warehouse";

export interface User {
    id: string;
    umkmId: string;
    branchId?: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

export interface UMKM {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    npwp?: string;
    logoUrl?: string;
    status: "active" | "inactive" | "suspended";
    createdAt: string;
}

export interface Branch {
    id: string;
    umkmId: string;
    name: string;
    code: string;
    address: string;
    phone?: string;
    taxRate: number;
    isActive: boolean;
    type: "simple" | "medium" | "large" | "warehouse";
    createdAt: string;
}

export interface Category {
    id: string;
    umkmId: string;
    name: string;
    parentId?: string;
    children?: Category[];
}

export interface Product {
    id: string;
    umkmId: string;
    sku: string;
    barcode?: string;
    name: string;
    description?: string;
    categoryId: string;
    categoryName?: string;
    unit: string;
    purchasePrice: number;
    sellingPrice: number;
    minStock: number;
    imageUrls?: string[];
    isActive: boolean;
    type: "global" | "local";
    branchId?: string;
    createdAt: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    value: string;
    price?: number;
}

export interface Stock {
    id: string;
    branchId: string;
    productId: string;
    quantity: number;
    reserved: number;
    lastUpdated: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    discount: number;
    discountType: "percent" | "nominal";
    price: number;
    note?: string;
}

export interface Transaction {
    id: string;
    invoiceNumber: string;
    branchId: string;
    branchName?: string;
    cashierId: string;
    cashierName?: string;
    customerName?: string;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    paymentMethod: "cash" | "card" | "qris" | "transfer" | "split";
    paidAmount: number;
    changeAmount: number;
    status: "pending" | "completed" | "voided" | "refunded";
    syncStatus: "synced" | "pending" | "conflict";
    items: TransactionItem[];
    payments?: Payment[];
    notes?: string;
    shiftId?: string;
    createdAt: string;
    voidedAt?: string;
    voidedBy?: string;
}

export interface TransactionItem {
    id: string;
    transactionId: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    discountAmount: number;
    subtotal: number;
}

export interface Payment {
    id: string;
    method: "cash" | "card" | "qris" | "transfer";
    amount: number;
}

export interface StockMovement {
    id: string;
    branchId: string;
    branchName?: string;
    productId: string;
    productName?: string;
    type: "in" | "out" | "transfer_out" | "transfer_in" | "adjustment";
    quantity: number;
    referenceId?: string;
    referenceNumber?: string;
    previousStock: number;
    newStock: number;
    createdBy: string;
    createdByName?: string;
    createdAt: string;
    notes?: string;
}

export interface StockTransfer {
    id: string;
    transferNumber: string;
    fromBranchId: string;
    fromBranchName?: string;
    toBranchId: string;
    toBranchName?: string;
    status: "pending" | "approved" | "in_transit" | "completed" | "rejected" | "cancelled";
    notes?: string;
    requestedBy: string;
    requestedByName?: string;
    approvedBy?: string;
    approvedByName?: string;
    requestedAt: string;
    completedAt?: string;
    items: StockTransferItem[];
}

export interface StockTransferItem {
    id: string;
    transferId: string;
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
}

export interface Shift {
    id: string;
    branchId: string;
    cashierId: string;
    cashierName?: string;
    openingBalance: number;
    closingBalance?: number; // Total reported by cashier (all payment types)
    expectedCash: number; // Opening + Cash Sales (system expected physical cash)
    actualCash?: number; // Physical cash counted by cashier
    difference?: number; // actualCash - expectedCash
    resolutionStatus?: "pending" | "resolved" | "none";
    resolutionNotes?: string;
    resolvedBy?: string;
    resolvedByName?: string;
    resolvedAt?: string;
    totalSales: number;
    totalTransactions: number;
    status: "open" | "closed";
    openedAt: string;
    closedAt?: string;
}

export interface Notification {
    id: string;
    type: "low_stock" | "transfer" | "void" | "system";
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
}

export interface DashboardMetrics {
    todayRevenue: number;
    todayTransactions: number;
    totalProducts: number;
    totalBranches: number;
    revenueGrowth: number;
    transactionGrowth: number;
}
