-- Database Schema for POS UMKM Multi-Cabang
-- Target: PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UMKM Table
CREATE TABLE umkm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    npwp VARCHAR(20),
    logo_url TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cabang Table
CREATE TABLE cabang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    umkm_id UUID NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    tax_rate DECIMAL(5,2) DEFAULT 11.00,
    is_active BOOLEAN DEFAULT TRUE,
    type VARCHAR(20) CHECK (type IN ('simple', 'medium', 'large', 'warehouse')) DEFAULT 'simple',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_cabang_code_per_umkm UNIQUE (umkm_id, code)
);

-- 3. Category Table
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    umkm_id UUID NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES category(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product Global Table
CREATE TABLE product_global (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    umkm_id UUID NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL,
    barcode VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    unit VARCHAR(20) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    selling_price DECIMAL(15,2) NOT NULL,
    min_stock INTEGER DEFAULT 0,
    image_urls TEXT[], -- Array of URLs
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_sku_per_umkm UNIQUE (umkm_id, sku)
);

-- 5. Product Local Table (Overrides/Extensions)
CREATE TABLE product_local (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cabang_id UUID NOT NULL REFERENCES cabang(id) ON DELETE CASCADE,
    product_global_id UUID REFERENCES product_global(id) ON DELETE CASCADE,
    selling_price DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    umkm_id UUID REFERENCES umkm(id) ON DELETE CASCADE,
    cabang_id UUID REFERENCES cabang(id) ON DELETE SET NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'admin', 'cashier', 'warehouse')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Shift Table
CREATE TABLE shift (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES cabang(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    opening_balance DECIMAL(15,2) NOT NULL,
    closing_balance DECIMAL(15,2),
    status VARCHAR(20) CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

-- 8. Transaction Table
CREATE TABLE transaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES cabang(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    shift_id UUID REFERENCES shift(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    subtotal DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'qris', 'transfer', 'split')) NOT NULL,
    paid_amount DECIMAL(15,2) NOT NULL,
    change_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'voided', 'refunded')) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    voided_at TIMESTAMP WITH TIME ZONE,
    voided_by UUID REFERENCES users(id)
);

-- 9. Transaction Item Table
CREATE TABLE transaction_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transaction(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product_global(id),
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL
);

-- 10. Payment Table (for split payments)
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transaction(id) ON DELETE CASCADE,
    method VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Stock Table
CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES cabang(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product_global(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_stock_per_branch UNIQUE (branch_id, product_id)
);

-- 12. Stock Movement Table
CREATE TABLE stock_movement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES cabang(id),
    product_id UUID NOT NULL REFERENCES product_global(id),
    type VARCHAR(20) CHECK (type IN ('in', 'out', 'transfer_out', 'transfer_in', 'adjustment')) NOT NULL,
    quantity INTEGER NOT NULL,
    reference_id UUID, -- Can link to transaction_id or transfer_id
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Transfer Stock Table
CREATE TABLE transfer_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    from_branch_id UUID NOT NULL REFERENCES cabang(id),
    to_branch_id UUID NOT NULL REFERENCES cabang(id),
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'in_transit', 'completed', 'rejected', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    requested_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 14. Transfer Item Table
CREATE TABLE transfer_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID NOT NULL REFERENCES transfer_stock(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product_global(id),
    quantity INTEGER NOT NULL,
    unit VARCHAR(20) NOT NULL
);

-- 15. Audit Log Table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX idx_transaction_branch ON transaction(branch_id);
CREATE INDEX idx_transaction_created_at ON transaction(created_at);
CREATE INDEX idx_stock_product ON stock(product_id);
CREATE INDEX idx_stock_branch ON stock(branch_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_product_sku ON product_global(sku);


-- SEED DATA (MOCK)
-- 1. UMKM
INSERT INTO umkm (id, name, email, phone, address, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Toko Sejahtera', 'owner@tokosejahtera.com', '021-1234567', 'Jl. Merdeka No. 1, Jakarta', 'active');

-- 2. Branches
INSERT INTO cabang (id, umkm_id, name, code, address, type) VALUES
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Cabang Pusat', 'CP01', 'Jl. Sudirman No. 10', 'large'),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Cabang Tangerang', 'TG01', 'Jl. Serpong No. 5', 'medium'),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Gudang Sentral', 'GS01', 'Kawasan Industri Jatake', 'warehouse');

-- 3. Users (Password: password123 / owner123 etc - hashes are for visualization)
INSERT INTO users (id, umkm_id, cabang_id, email, password_hash, full_name, role) VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', NULL, 'owner@tokosejahtera.com', '$2b$12$K7...', 'Bu Siti Rahma', 'owner'),
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'admin@tokosejahtera.com', '$2b$12$K7...', 'Andi Admin', 'admin'),
('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'kasir@tokosejahtera.com', '$2b$12$K7...', 'Cici Kasir', 'cashier');
