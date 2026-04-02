import { UMKM, Branch, User, Category, Product, Stock, Transaction, StockMovement, StockTransfer, Shift } from "@/lib/types";

export const mockUMKM: UMKM = {
    id: "umkm-001",
    name: "Toko Sejahtera Group",
    email: "owner@tokosejahtera.com",
    phone: "0812-3456-7890",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    npwp: "12.345.678.9-012.000",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
};

export const mockBranches: Branch[] = [
    { id: "branch-001", umkmId: "umkm-001", name: "Cabang Sudirman", code: "SDR", address: "Jl. Sudirman No. 123, Jakarta Pusat", phone: "021-5551234", taxRate: 11, isActive: true, type: "large", createdAt: "2024-01-15T08:00:00Z" },
    { id: "branch-002", umkmId: "umkm-001", name: "Cabang Kemang", code: "KMG", address: "Jl. Kemang Raya No. 45, Jakarta Selatan", phone: "021-5555678", taxRate: 11, isActive: true, type: "medium", createdAt: "2024-02-01T08:00:00Z" },
    { id: "branch-003", umkmId: "umkm-001", name: "Cabang Kelapa Gading", code: "KGD", address: "Jl. Kelapa Gading Permai, Jakarta Utara", phone: "021-5559012", taxRate: 11, isActive: true, type: "medium", createdAt: "2024-03-01T08:00:00Z" },
    { id: "branch-004", umkmId: "umkm-001", name: "Cabang Cibubur", code: "CBR", address: "Jl. Cibubur No. 78, Jakarta Timur", phone: "021-5553456", taxRate: 11, isActive: true, type: "simple", createdAt: "2024-04-01T08:00:00Z" },
    { id: "branch-005", umkmId: "umkm-001", name: "Gudang Pusat", code: "GDP", address: "Jl. Bekasi Raya No. 200, Bekasi", phone: "021-8881234", taxRate: 0, isActive: true, type: "warehouse", createdAt: "2024-01-15T08:00:00Z" },
];

export const mockUsers: User[] = [
    { id: "user-001", umkmId: "umkm-001", email: "owner@tokosejahtera.com", fullName: "Bu Siti Rahma", role: "owner", isActive: true, lastLogin: "2026-04-02T09:00:00Z", createdAt: "2024-01-15T08:00:00Z" },
    { id: "user-002", umkmId: "umkm-001", branchId: "branch-001", email: "admin.sdm@tokosejahtera.com", fullName: "Dian Permata", role: "admin", isActive: true, lastLogin: "2026-04-02T08:30:00Z", createdAt: "2024-01-15T08:00:00Z" },
    { id: "user-003", umkmId: "umkm-001", branchId: "branch-001", email: "kasir1.sdm@tokosejahtera.com", fullName: "Ani Rahayu", role: "cashier", isActive: true, lastLogin: "2026-04-02T08:00:00Z", createdAt: "2024-01-15T08:00:00Z" },
    { id: "user-004", umkmId: "umkm-001", branchId: "branch-001", email: "gudang.sdm@tokosejahtera.com", fullName: "Bambang Santoso", role: "warehouse", isActive: true, lastLogin: "2026-04-01T10:00:00Z", createdAt: "2024-01-15T08:00:00Z" },
    { id: "user-005", umkmId: "umkm-001", branchId: "branch-002", email: "admin.kmg@tokosejahtera.com", fullName: "Roni Hidayat", role: "admin", isActive: true, lastLogin: "2026-04-02T07:45:00Z", createdAt: "2024-02-01T08:00:00Z" },
    { id: "user-006", umkmId: "umkm-001", branchId: "branch-002", email: "kasir.kmg@tokosejahtera.com", fullName: "Lisa Maharani", role: "cashier", isActive: true, lastLogin: "2026-04-02T08:10:00Z", createdAt: "2024-02-01T08:00:00Z" },
    { id: "user-007", umkmId: "umkm-001", branchId: "branch-003", email: "admin.kgd@tokosejahtera.com", fullName: "Hendra Wijaya", role: "admin", isActive: true, lastLogin: "2026-04-01T16:00:00Z", createdAt: "2024-03-01T08:00:00Z" },
    { id: "user-008", umkmId: "umkm-001", branchId: "branch-004", email: "kasir.cbr@tokosejahtera.com", fullName: "Sari Dewi", role: "cashier", isActive: true, lastLogin: "2026-04-02T09:00:00Z", createdAt: "2024-04-01T08:00:00Z" },
];

export const DEMO_ACCOUNTS = [
    { email: "owner@tokosejahtera.com", password: "owner123", role: "owner", name: "Bu Siti Rahma" },
    { email: "admin.sdm@tokosejahtera.com", password: "admin123", role: "admin", name: "Dian Permata" },
    { email: "kasir1.sdm@tokosejahtera.com", password: "kasir123", role: "cashier", name: "Ani Rahayu" },
    { email: "gudang.sdm@tokosejahtera.com", password: "gudang123", role: "warehouse", name: "Bambang Santoso" },
];

export const mockCategories: Category[] = [
    {
        id: "cat-001", umkmId: "umkm-001", name: "Minuman", children: [
            { id: "cat-001-1", umkmId: "umkm-001", name: "Air Mineral", parentId: "cat-001" },
            { id: "cat-001-2", umkmId: "umkm-001", name: "Minuman Kemasan", parentId: "cat-001" },
            { id: "cat-001-3", umkmId: "umkm-001", name: "Kopi & Teh", parentId: "cat-001" },
        ]
    },
    {
        id: "cat-002", umkmId: "umkm-001", name: "Makanan", children: [
            { id: "cat-002-1", umkmId: "umkm-001", name: "Makanan Instan", parentId: "cat-002" },
            { id: "cat-002-2", umkmId: "umkm-001", name: "Snack & Cemilan", parentId: "cat-002" },
        ]
    },
    {
        id: "cat-003", umkmId: "umkm-001", name: "Kebersihan", children: [
            { id: "cat-003-1", umkmId: "umkm-001", name: "Sabun & Sampo", parentId: "cat-003" },
            { id: "cat-003-2", umkmId: "umkm-001", name: "Deterjen", parentId: "cat-003" },
        ]
    },
    { id: "cat-004", umkmId: "umkm-001", name: "Rokok" },
    { id: "cat-005", umkmId: "umkm-001", name: "Sembako" },
];

export const mockProducts: Product[] = [
    { id: "prod-001", umkmId: "umkm-001", sku: "AQU-600", barcode: "8999999900123", name: "Aqua 600ml", categoryId: "cat-001-1", categoryName: "Air Mineral", unit: "botol", purchasePrice: 2500, sellingPrice: 3500, minStock: 20, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-002", umkmId: "umkm-001", sku: "AQU-1500", barcode: "8999999900124", name: "Aqua 1500ml", categoryId: "cat-001-1", categoryName: "Air Mineral", unit: "botol", purchasePrice: 4000, sellingPrice: 5500, minStock: 15, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-003", umkmId: "umkm-001", sku: "IND-GRG", barcode: "8999999900200", name: "Indomie Goreng", categoryId: "cat-002-1", categoryName: "Makanan Instan", unit: "bungkus", purchasePrice: 2800, sellingPrice: 3500, minStock: 50, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-004", umkmId: "umkm-001", sku: "IND-SOP", barcode: "8999999900201", name: "Indomie Soto", categoryId: "cat-002-1", categoryName: "Makanan Instan", unit: "bungkus", purchasePrice: 2800, sellingPrice: 3500, minStock: 50, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-005", umkmId: "umkm-001", sku: "PKC-RED", barcode: "8999999900300", name: "Pocari Sweat 350ml", categoryId: "cat-001-2", categoryName: "Minuman Kemasan", unit: "kaleng", purchasePrice: 6000, sellingPrice: 8000, minStock: 24, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-006", umkmId: "umkm-001", sku: "GGS-240", barcode: "8999999900400", name: "Goodday Cappuccino", categoryId: "cat-001-3", categoryName: "Kopi & Teh", unit: "kaleng", purchasePrice: 7000, sellingPrice: 9000, minStock: 12, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-007", umkmId: "umkm-001", sku: "LYS-BTG", barcode: "8999999900500", name: "Lays Original 68g", categoryId: "cat-002-2", categoryName: "Snack & Cemilan", unit: "pack", purchasePrice: 10000, sellingPrice: 13000, minStock: 10, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-008", umkmId: "umkm-001", sku: "DTV-100", barcode: "8999999900600", name: "Dove Sabun Mandi 100g", categoryId: "cat-003-1", categoryName: "Sabun & Sampo", unit: "pcs", purchasePrice: 8000, sellingPrice: 11000, minStock: 10, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-009", umkmId: "umkm-001", sku: "RNS-COL", barcode: "8999999900700", name: "Rinso Color 900gr", categoryId: "cat-003-2", categoryName: "Deterjen", unit: "kg", purchasePrice: 18000, sellingPrice: 23000, minStock: 8, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-010", umkmId: "umkm-001", sku: "SMP-KRT", barcode: "8999999900800", name: "Sampoerna Kretek 12s", categoryId: "cat-004", categoryName: "Rokok", unit: "bungkus", purchasePrice: 22000, sellingPrice: 26000, minStock: 20, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-011", umkmId: "umkm-001", sku: "MAS-5KG", barcode: "8999999901000", name: "Beras Premium 5kg", categoryId: "cat-005", categoryName: "Sembako", unit: "karung", purchasePrice: 68000, sellingPrice: 78000, minStock: 10, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-012", umkmId: "umkm-001", sku: "MNY-1L", barcode: "8999999901100", name: "Minyak Goreng Bimoli 1L", categoryId: "cat-005", categoryName: "Sembako", unit: "liter", purchasePrice: 15000, sellingPrice: 18000, minStock: 15, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
    { id: "prod-013", umkmId: "umkm-001", sku: "SMP-MNT", barcode: "8888000001001", name: "Sampoerna Mild Terbatas", categoryId: "cat-004", categoryName: "Rokok", unit: "bungkus", purchasePrice: 30000, sellingPrice: 35000, minStock: 5, isActive: true, type: "local", branchId: "branch-001", createdAt: "2024-02-15T08:00:00Z" },
    { id: "prod-014", umkmId: "umkm-001", sku: "KPI-SDR", barcode: "8888000002001", name: "Kopi Spesial Sudirman", categoryId: "cat-001-3", categoryName: "Kopi & Teh", unit: "cup", purchasePrice: 8000, sellingPrice: 15000, minStock: 20, isActive: true, type: "local", branchId: "branch-001", createdAt: "2024-02-20T08:00:00Z" },
    { id: "prod-015", umkmId: "umkm-001", sku: "TCH-BOT", barcode: "8888000003001", name: "Teh Botol Sosro 450ml", categoryId: "cat-001-2", categoryName: "Minuman Kemasan", unit: "botol", purchasePrice: 4000, sellingPrice: 6000, minStock: 24, isActive: true, type: "global", createdAt: "2024-01-15T08:00:00Z" },
];

export const mockStock: Stock[] = [
    // Branch 001 - Sudirman
    { id: "stk-001", branchId: "branch-001", productId: "prod-001", quantity: 150, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-002", branchId: "branch-001", productId: "prod-002", quantity: 80, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-003", branchId: "branch-001", productId: "prod-003", quantity: 12, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-004", branchId: "branch-001", productId: "prod-004", quantity: 200, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-005", branchId: "branch-001", productId: "prod-005", quantity: 48, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-006", branchId: "branch-001", productId: "prod-006", quantity: 36, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-007", branchId: "branch-001", productId: "prod-007", quantity: 5, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-008", branchId: "branch-001", productId: "prod-008", quantity: 20, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-009", branchId: "branch-001", productId: "prod-009", quantity: 15, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-010", branchId: "branch-001", productId: "prod-010", quantity: 100, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-011", branchId: "branch-001", productId: "prod-011", quantity: 3, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-012", branchId: "branch-001", productId: "prod-012", quantity: 25, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-013", branchId: "branch-001", productId: "prod-013", quantity: 30, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-014", branchId: "branch-001", productId: "prod-014", quantity: 0, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-015", branchId: "branch-001", productId: "prod-015", quantity: 60, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    // Branch 002 - Kemang
    { id: "stk-016", branchId: "branch-002", productId: "prod-001", quantity: 90, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-017", branchId: "branch-002", productId: "prod-003", quantity: 70, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-018", branchId: "branch-002", productId: "prod-005", quantity: 8, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-019", branchId: "branch-002", productId: "prod-010", quantity: 45, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
    { id: "stk-020", branchId: "branch-002", productId: "prod-015", quantity: 30, reserved: 0, lastUpdated: "2026-04-02T10:00:00Z" },
];

const todayStr = "2026-04-02";
export const mockTransactions: Transaction[] = [
    {
        id: "trx-001", invoiceNumber: "INV/20260402/00001", branchId: "branch-001", branchName: "Cabang Sudirman",
        cashierId: "user-003", cashierName: "Ani Rahayu", subtotal: 21000, discountAmount: 0, taxAmount: 2310,
        totalAmount: 23310, paymentMethod: "cash", paidAmount: 25000, changeAmount: 1690, status: "completed", syncStatus: "synced",
        items: [
            { id: "item-001", transactionId: "trx-001", productId: "prod-001", productName: "Aqua 600ml", sku: "AQU-600", quantity: 3, price: 3500, discountAmount: 0, subtotal: 10500 },
            { id: "item-002", transactionId: "trx-001", productId: "prod-003", productName: "Indomie Goreng", sku: "IND-GRG", quantity: 3, price: 3500, discountAmount: 0, subtotal: 10500 },
        ],
        createdAt: `${todayStr}T08:15:00Z`
    },
    {
        id: "trx-002", invoiceNumber: "INV/20260402/00002", branchId: "branch-001", branchName: "Cabang Sudirman",
        cashierId: "user-003", cashierName: "Ani Rahayu", subtotal: 52000, discountAmount: 2000, taxAmount: 5500,
        totalAmount: 55500, paymentMethod: "qris", paidAmount: 55500, changeAmount: 0, status: "completed", syncStatus: "synced",
        items: [
            { id: "item-003", transactionId: "trx-002", productId: "prod-010", productName: "Sampoerna Kretek 12s", sku: "SMP-KRT", quantity: 2, price: 26000, discountAmount: 1000, subtotal: 51000 },
        ],
        createdAt: `${todayStr}T09:30:00Z`
    },
    {
        id: "trx-003", invoiceNumber: "INV/20260402/00003", branchId: "branch-002", branchName: "Cabang Kemang",
        cashierId: "user-006", cashierName: "Lisa Maharani", subtotal: 38000, discountAmount: 0, taxAmount: 4180,
        totalAmount: 42180, paymentMethod: "card", paidAmount: 42180, changeAmount: 0, status: "completed", syncStatus: "synced",
        items: [
            { id: "item-004", transactionId: "trx-003", productId: "prod-007", productName: "Lays Original 68g", sku: "LYS-BTG", quantity: 2, price: 13000, discountAmount: 0, subtotal: 26000 },
            { id: "item-005", transactionId: "trx-003", productId: "prod-005", productName: "Pocari Sweat 350ml", sku: "PKC-RED", quantity: 1, price: 8000, discountAmount: 0, subtotal: 8000 },
            { id: "item-006", transactionId: "trx-003", productId: "prod-015", productName: "Teh Botol Sosro 450ml", sku: "TCH-BOT", quantity: 1, price: 6000, discountAmount: 0, subtotal: 6000 },
        ],
        createdAt: `${todayStr}T10:45:00Z`
    },
    {
        id: "trx-004", invoiceNumber: "INV/20260402/00004", branchId: "branch-001", branchName: "Cabang Sudirman",
        cashierId: "user-003", cashierName: "Ani Rahayu", subtotal: 156000, discountAmount: 6000, taxAmount: 16500,
        totalAmount: 166500, paymentMethod: "cash", paidAmount: 170000, changeAmount: 3500, status: "completed", syncStatus: "synced",
        items: [
            { id: "item-007", transactionId: "trx-004", productId: "prod-011", productName: "Beras Premium 5kg", sku: "MAS-5KG", quantity: 2, price: 78000, discountAmount: 3000, subtotal: 153000 },
        ],
        createdAt: `${todayStr}T11:20:00Z`
    },
    {
        id: "trx-005", invoiceNumber: "INV/20260402/00005", branchId: "branch-003", branchName: "Cabang Kelapa Gading",
        cashierId: "user-007", cashierName: "Hendra Wijaya", subtotal: 45000, discountAmount: 0, taxAmount: 4950,
        totalAmount: 49950, paymentMethod: "transfer", paidAmount: 49950, changeAmount: 0, status: "completed", syncStatus: "synced",
        items: [
            { id: "item-008", transactionId: "trx-005", productId: "prod-009", productName: "Rinso Color 900gr", sku: "RNS-COL", quantity: 2, price: 23000, discountAmount: 0, subtotal: 46000 },
        ],
        createdAt: `${todayStr}T13:00:00Z`
    },
];

export const mockStockTransfers: StockTransfer[] = [
    {
        id: "trf-001", transferNumber: "TRF/20260402/00001",
        fromBranchId: "branch-005", fromBranchName: "Gudang Pusat",
        toBranchId: "branch-001", toBranchName: "Cabang Sudirman",
        status: "completed", notes: "Restock rutin mingguan",
        requestedBy: "user-002", requestedByName: "Dian Permata",
        approvedBy: "user-001", approvedByName: "Bu Siti Rahma",
        requestedAt: "2026-03-30T08:00:00Z", completedAt: "2026-04-01T14:00:00Z",
        items: [
            { id: "ti-001", transferId: "trf-001", productId: "prod-001", productName: "Aqua 600ml", quantity: 100, unit: "botol" },
            { id: "ti-002", transferId: "trf-001", productId: "prod-003", productName: "Indomie Goreng", quantity: 200, unit: "bungkus" },
        ]
    },
    {
        id: "trf-002", transferNumber: "TRF/20260402/00002",
        fromBranchId: "branch-001", fromBranchName: "Cabang Sudirman",
        toBranchId: "branch-002", toBranchName: "Cabang Kemang",
        status: "in_transit", notes: "Transfer stok pocari sweat karena kemang kehabisan",
        requestedBy: "user-005", requestedByName: "Roni Hidayat",
        requestedAt: "2026-04-02T09:00:00Z",
        items: [
            { id: "ti-003", transferId: "trf-002", productId: "prod-005", productName: "Pocari Sweat 350ml", quantity: 24, unit: "kaleng" },
        ]
    },
    {
        id: "trf-003", transferNumber: "TRF/20260402/00003",
        fromBranchId: "branch-005", fromBranchName: "Gudang Pusat",
        toBranchId: "branch-004", toBranchName: "Cabang Cibubur",
        status: "pending", notes: "Permintaan restock bulanan",
        requestedBy: "user-008", requestedByName: "Sari Dewi",
        requestedAt: "2026-04-02T14:00:00Z",
        items: [
            { id: "ti-004", transferId: "trf-003", productId: "prod-011", productName: "Beras Premium 5kg", quantity: 20, unit: "karung" },
            { id: "ti-005", transferId: "trf-003", productId: "prod-012", productName: "Minyak Goreng Bimoli 1L", quantity: 36, unit: "liter" },
        ]
    },
];

export const mockStockMovements: StockMovement[] = [
    { id: "mov-001", branchId: "branch-001", branchName: "Cabang Sudirman", productId: "prod-001", productName: "Aqua 600ml", type: "in", quantity: 100, referenceNumber: "TRF/20260401/00001", previousStock: 53, newStock: 153, createdBy: "user-004", createdByName: "Bambang Santoso", createdAt: "2026-04-01T14:00:00Z" },
    { id: "mov-002", branchId: "branch-001", branchName: "Cabang Sudirman", productId: "prod-001", productName: "Aqua 600ml", type: "out", quantity: 3, referenceNumber: "INV/20260402/00001", previousStock: 153, newStock: 150, createdBy: "user-003", createdByName: "Ani Rahayu", createdAt: "2026-04-02T08:15:00Z" },
    { id: "mov-003", branchId: "branch-001", branchName: "Cabang Sudirman", productId: "prod-003", productName: "Indomie Goreng", type: "out", quantity: 3, referenceNumber: "INV/20260402/00001", previousStock: 15, newStock: 12, createdBy: "user-003", createdByName: "Ani Rahayu", createdAt: "2026-04-02T08:15:00Z" },
    { id: "mov-004", branchId: "branch-002", branchName: "Cabang Kemang", productId: "prod-007", productName: "Lays Original 68g", type: "out", quantity: 2, referenceNumber: "INV/20260402/00003", previousStock: 10, newStock: 8, createdBy: "user-006", createdByName: "Lisa Maharani", createdAt: "2026-04-02T10:45:00Z" },
];

export const mockShifts: Shift[] = [
    {
        id: "shift-001", branchId: "branch-001", cashierId: "user-003", cashierName: "Ani Rahayu",
        openingBalance: 500000, totalSales: 0, totalTransactions: 0,
        status: "open", openedAt: "2026-04-02T07:00:00Z"
    }
];

export const getSalesChartData = () => {
    return [
        { date: "27 Mar", revenue: 1250000, transactions: 45 },
        { date: "28 Mar", revenue: 1890000, transactions: 67 },
        { date: "29 Mar", revenue: 1340000, transactions: 52 },
        { date: "30 Mar", revenue: 2100000, transactions: 78 },
        { date: "31 Mar", revenue: 1780000, transactions: 63 },
        { date: "1 Apr", revenue: 2350000, transactions: 89 },
        { date: "2 Apr", revenue: 1680000, transactions: 58 },
    ];
};

export const getBranchSalesData = () => {
    return [
        { branch: "Sudirman", revenue: 875000, transactions: 32 },
        { branch: "Kemang", revenue: 420000, transactions: 15 },
        { branch: "Kel. Gading", revenue: 198000, transactions: 8 },
        { branch: "Cibubur", revenue: 115000, transactions: 4 },
        { branch: "Gudang", revenue: 0, transactions: 0 },
    ];
};
