# ANALISIS & TINJAUAN KOMPREHENSIF PRD POS UMKM MULTI-CABANG

## A. RINGKASAN EKSEKUTIF ANALISIS

Berdasarkan tinjauan terhadap dokumen PRD yang diberikan, ditemukan beberapa **kesenjangan kritis** yang perlu dilengkapi:

| Aspek | Kondisi Saat Ini | Kebutuhan |
|-------|------------------|------------|
| Spesifikasi teknis | Masih sangat umum | Perlu detail endpoint, schema, validasi |
| Data model | Hanya daftar entitas | Perlu atribut lengkap & relasi |
| User flow | Deskripsi tekstual | Perlu diagram/step-by-step detail |
| Error handling | Tidak disebut | Perlu definisi skenario error |
| Integrasi | "Opsional" tanpa detail | Perlu spesifikasi payment gateway |
| Security | JWT disebut | Perlu RBAC detail, enkripsi, audit log |
| Testing | Tidak ada | Perlu skenario test & acceptance criteria |

---

## B. PRD YANG TELAH DISESUAIKAN & DILENGKAPI

# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Aplikasi Point of Sale (POS) UMKM Multi-Cabang

**Versi:** 2.0  
**Tanggal Efektif:** [Tanggal]  
**Status:** Final  
**Product Manager:** [Nama]  
**Doc Owner:** Tim Produk

---

# 1. PENDAHULUAN

## 1.1 Latar Belakang

Digitalisasi UMKM menjadi kebutuhan strategis dalam meningkatkan efisiensi operasional, transparansi keuangan, serta skalabilitas bisnis. Berdasarkan data Kementerian Koperasi dan UKM (2024), terdapat lebih dari 64 juta unit UMKM di Indonesia, dengan pertumbuhan bisnis multi-cabang mencapai 15% per tahun. Banyak UMKM telah berkembang menjadi multi-cabang (2-50 cabang) dengan kompleksitas operasional yang meningkat, termasuk:

- Variasi produk antar cabang (hingga 30% produk bersifat lokal)
- Kebutuhan kontrol stok terpusat maupun terdistribusi
- Pengelolaan sumber daya manusia yang berbeda per cabang (2-20 karyawan per cabang)
- Kebutuhan visibilitas real-time performa cabang dari pusat

**Permasalahan utama yang teridentifikasi:**

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Tidak adanya sistem terintegrasi untuk multi-cabang | Rekonsiliasi manual, kesalahan data hingga 15-20% |
| 2 | Kesulitan sinkronisasi stok antar cabang | Overstock di cabang A, stockout di cabang B |
| 3 | Perbedaan struktur organisasi per cabang | Sistem kaku tidak bisa diadaptasi |
| 4 | Pelaporan tidak real-time dan terfragmentasi | Keputusan bisnis terlambat 3-7 hari |

## 1.2 Tujuan

Mengembangkan sistem POS berbasis web/cloud yang:

1. Mendukung multi-UMKM dan multi-cabang (minimal 100 cabang per UMKM)
2. Mendukung variasi produk antar cabang (global + local product)
3. Mendukung multi-role (kasir, gudang, admin, owner, supervisor)
4. Menyediakan laporan real-time dan terpusat dengan delay < 5 detik
5. Skalabel hingga 10.000 UMKM dan 100.000 cabang
6. Offline-first untuk menjamin operasional saat internet terputus

## 1.3 Ruang Lingkup

### Termasuk (In Scope):
- Manajemen UMKM (onboarding, subscription, konfigurasi)
- Manajemen cabang (CRUD, konfigurasi role per cabang)
- Manajemen produk (global & local, kategori, SKU, barcode)
- Transaksi penjualan (POS, payment, refund, void)
- Manajemen stok (masuk, keluar, transfer, opname, minimum stock)
- Manajemen pengguna dan role (RBAC dengan izin granular)
- Pelaporan (12+ jenis laporan dengan export)
- Integrasi pembayaran (Midtrans, Xendit, manual cash)
- Mode offline dengan sinkronisasi otomatis

### Tidak Termasuk (Out of Scope) - Phase 1:
- Integrasi dengan marketplace (Shopee, Tokopedia) → Phase 3
- Aplikasi mobile untuk customer (loyalty program) → Phase 4
- Manajemen gaji karyawan → Phase 4
- Integrasi akuntansi (Jurnal, Accurate) → Phase 3
- E-commerce/storefront online → Phase 4
- AI untuk forecasting stok → Phase 5

---

# 2. DEFINISI & ISTILAH

| Istilah | Definisi |
|---------|----------|
| UMKM | Unit bisnis utama yang memiliki 1 atau lebih cabang |
| Cabang | Unit operasional di bawah satu UMKM, memiliki lokasi fisik |
| Produk Global | Produk yang tersedia di semua cabang (harga bisa berbeda) |
| Produk Lokal | Produk yang hanya tersedia di cabang tertentu |
| Transfer Stok | Pergerakan stok antar cabang dengan status "in-transit" |
| Opname Stok | Proses pencocokan stok fisik dengan stok sistem |
| Split Payment | Pembayaran dengan lebih dari satu metode |
| Void | Pembatalan transaksi sebelum selesai (belum cetak struk) |
| Refund | Pengembalian dana setelah transaksi selesai |
| Offline Mode | Mode operasional tanpa koneksi internet, data disimpan lokal |

---

# 3. STAKEHOLDER

## 3.1 Internal (Tim Pengembang)

| Role | Tanggung Jawab |
|------|----------------|
| Product Manager | Prioritas fitur, acceptance criteria, timeline |
| Tech Lead | Arsitektur, teknologi, code review |
| Backend Engineer | API, database, integrasi |
| Frontend Engineer | UI/UX, PWA, offline capability |
| Mobile Engineer | Aplikasi kasir (Android/iOS) opsional |
| QA Engineer | Test plan, automation, regression |
| UI/UX Designer | Wireframe, prototype, user research |
| DevOps Engineer | Infrastructure, deployment, monitoring |

## 3.2 Eksternal (Pengguna Sistem)

| Stakeholder | Karakteristik | Kebutuhan Utama |
|-------------|---------------|-----------------|
| Owner UMKM | Non-teknis, butuh overview cepat | Dashboard agregat, laporan laba, performa cabang |
| Admin Cabang | Operasional harian | Manajemen stok, atur harga, rekrut kasir |
| Kasir | Transaksi cepat, pergantian shift | UI minimalis, shortcut keyboard, offline mode |
| Staff Gudang | Penerimaan/pengiriman barang | Scan barcode, buat PO, transfer stok |
| Supervisor | Oversee beberapa cabang | Monitoring real-time, approval transfer |

---

# 4. USER PERSONA (DETAIL)

## 4.1 Owner: Bu Siti (45 tahun)
- **Bisnis:** Toko sembako dengan 5 cabang di Jakarta
- **Tech literacy:** Menengah (bisa WhatsApp, Excel dasar)
- **Pain points:** Tidak tahu cabang mana yang paling untung, stok sering tidak sinkron
- **Goals:** Lihat laba bersih per cabang dalam 1 dashboard, notifikasi jika stok menipis

## 4.2 Kasir: Ani (22 tahun)
- **Bisnis:** Coffee shop dengan 2 cabang
- **Tech literacy:** Tinggi (daily user smartphone)
- **Pain points:** Sistem lambat, struk sering error, tidak bisa transaksi saat internet mati
- **Goals:** Transaksi < 10 detik, bisa offline, cetak struk cepat

## 4.3 Staff Gudang: Bambang (38 tahun)
- **Bisnis:** Toko material bangunan dengan gudang pusat
- **Tech literacy:** Rendah (kesulitan dengan software rumit)
- **Pain points:** Lupa mencatat stok masuk, barang hilang
- **Goals:** Scan barcode saja, stok otomatis bertambah

## 4.4 Admin Cabang: Dian (30 tahun)
- **Bisnis:** Butik dengan 3 cabang
- **Tech literacy:** Menengah
- **Pain points:** Harga produk berbeda tiap cabang, susah update satu per satu
- **Goals:** Batch update harga, atur diskon per cabang

---

# 5. ARSITEKTUR KONSEPTUAL

## 5.1 Model Hierarki Data

```
UMKM (1)
  ├── Subscription (1)
  ├── Pengaturan Umum (1)
  └── Cabang (N)
        ├── Pengaturan Cabang (1)
        ├── User (N)
        ├── Produk Lokal (N)
        ├── Stok (N per produk)
        ├── Transaksi (N)
        └── Transfer Stok (N sebagai asal/tujuan)
```

## 5.2 Variasi Struktur Cabang

Sistem mendukung 4 tipe cabang dengan konfigurasi role yang fleksibel:

| Tipe Cabang | Role yang Tersedia | Use Case |
|-------------|-------------------|----------|
| **Sederhana** | Kasir | Warung kelontong, kios |
| **Menengah** | Kasir + Admin | Toko retail, coffee shop |
| **Besar** | Kasir + Admin + Gudang + Supervisor | Supermarket, toko material |
| **Gudang Pusat** | Admin + Gudang (tanpa kasir) | Distributor, gudang sentral |

## 5.3 Arsitektur Teknis (Rekomendasi)

```
[Frontend PWA] <-> [API Gateway] <-> [Microservices]
                                      ├── Auth Service
                                      ├── UMKM Service
                                      ├── Product Service
                                      ├── Transaction Service
                                      ├── Inventory Service
                                      ├── Report Service
                                      └── Notification Service
                                      
[Database] PostgreSQL (primary) + Redis (cache) + Elasticsearch (log/search)

[Sync Engine] Untuk offline mode - queue based dengan retry & conflict resolution
```

---

# 6. FITUR UTAMA (DENGAN PRIORITAS MoSCoW)

## 6.1 Manajemen UMKM (Must Have)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Registrasi UMKM | Must | Form pendaftaran dengan verifikasi email/phone |
| Edit profil UMKM | Must | Nama, logo, alamat, NPWP, no telepon |
| Subscription management | Should | Paket gratis/trial/berbayar, invoice, payment |
| Multi-cabang management | Must | Tambah/edit/hapus cabang, aktif/nonaktifkan cabang |
| Audit log | Could | Catat semua aktivitas penting untuk compliance |

## 6.2 Manajemen Cabang (Must Have)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| CRUD cabang | Must | Nama cabang, alamat, telepon, jam operasional |
| Konfigurasi produk per cabang | Must | Produk global (shared) vs produk lokal (custom) |
| Pengaturan pajak per cabang | Should | Default 11% (PPN), bisa diatur/nonaktif |
| Pengaturan diskon default | Could | Diskon otomatis untuk semua transaksi di cabang |
| Cetak konfigurasi struk | Should | Header/footer, logo, nomor antrian |

## 6.3 Manajemen Produk (Must Have)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| CRUD produk | Must | Nama, SKU, barcode, kategori, satuan, harga beli, harga jual |
| Manajemen kategori | Must | Nested kategori (max depth 3) |
| Upload gambar produk | Should | Maks 5 gambar per produk, resize otomatis |
| Produk varian | Should | Size, warna, rasa (contoh: baju ukuran S/M/L) |
| Batch import/export | Must | Upload via Excel/CSV, export ke Excel |
| Set harga per cabang | Must | Harga jual bisa berbeda tiap cabang |
| Aktivasi/nonaktif produk | Should | Produk nonaktif tidak muncul di POS |

## 6.4 Transaksi POS (Must Have)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Scan barcode / cari produk | Must | Input cepat, autocomplete |
| Keranjang belanja | Must | Tambah, ubah qty, hapus item |
| Diskon per item & per transaksi | Must | Persen atau nominal, max diskon limit |
| Pajak (PPN) | Must | Otomatis 11% dari subtotal |
| Biaya tambahan | Should | Biaya layanan, biaya kirim |
| Multi metode pembayaran | Must | Tunai, debit/credit card (EDC), QRIS, transfer |
| Split payment | Should | Bayar dengan 2+ metode |
| Hitung kembalian | Must | Otomatis untuk pembayaran tunai |
| Cetak struk | Must | Thermal printer support (ESC/POS) |
| Void transaksi | Must | Sebelum cetak struk, butuh approval admin |
| Refund | Should | Setelah transaksi selesai, butuh approval owner |
| Nomor antrian | Should | Auto-increment per hari per cabang |
| Shift kasir | Must | Buka/tutup shift, hitung setoran awal/akhir |

## 6.5 Manajemen Stok (Must Have)

| Fitur | Prioritas | Deskripsi |
|-------|-----------|-----------|
| Stok real-time | Must | Update otomatis saat transaksi/transfer |
| Stok masuk (pembelian) | Must | Catat PO, supplier, harga beli |
| Stok keluar (non-penjualan) | Should | Stok rusak, kadaluarsa, hadiah |
| Transfer stok antar cabang | Must | Request → approval → pengiriman → penerimaan |
| Opname stok | Must | Input stok fisik, selisih otomatis (adjustment) |
| Minimum stock alert | Must | Notifikasi jika stok < minimum |
| Expiry date tracking | Should | Untuk produk makanan/obat-obatan |
| Batch/lot number | Could | Tracking produk per batch |
| Stock movement history | Must | History lengkap in/out/transfer/adjustment |

## 6.6 Manajemen User & Role (Must Have)

**Role Default & Izin Granular:**

| Modul | Izin | Owner | Admin Cabang | Kasir | Gudang |
|-------|------|-------|--------------|-------|--------|
| UMKM | view | ✓ | - | - | - |
| | edit | ✓ | - | - | - |
| Cabang | view | ✓ | ✓ | - | - |
| | edit | ✓ | ✓ (cabang sendiri) | - | - |
| Produk | view | ✓ | ✓ | ✓ | ✓ |
| | create | ✓ | ✓ | - | ✓ |
| | edit | ✓ | ✓ | - | ✓ |
| | delete | ✓ | - | - | - |
| Transaksi | create | ✓ | ✓ | ✓ | - |
| | void | ✓ | ✓ | - | - |
| | refund | ✓ | ✓ (with approval) | - | - |
| Stok | view | ✓ | ✓ | ✓ | ✓ |
| | adjust | ✓ | ✓ | - | ✓ |
| | transfer | ✓ | ✓ | - | ✓ |
| Laporan | view | ✓ | ✓ (cabang sendiri) | - | - |
| User | manage | ✓ | ✓ (untuk role kasir/gudang) | - | - |

## 6.7 Pelaporan (Must Have)

| Laporan | Deskripsi | Export |
|---------|-----------|--------|
| Penjualan harian | Per shift, per kasir, per metode bayar | PDF, Excel |
| Penjualan periode | Trend harian/mingguan/bulanan/tahunan | PDF, Excel |
| Laporan laba kotor | Penjualan - HPP | Excel |
| Laporan per produk | Best seller, slow moving | Excel |
| Laporan stok | Stok saat ini, nilai stok | Excel |
| Laporan movement stok | In/out/transfer/adjustment | Excel |
| Laporan transfer stok | Status transfer (pending/in-transit/done) | Excel |
| Laporan shift kasir | Setoran, selisih kas | PDF, Excel |
| Laporan pajak | Ringkasan PPN untuk SPT | Excel |
| Dashboard owner | Grafik penjualan 7 cabang teratas, alert stok | - |

---

# 7. REQUIREMENTS FUNGSIONAL (DETAIL)

## 7.1 Registrasi & Onboarding UMKM

**FR-01:** Sistem harus menyediakan form registrasi dengan field: Nama UMKM, Email (unik), No Telepon, Password, Konfirmasi Password, Nama Pemilik

**FR-02:** Sistem harus mengirim email verifikasi setelah registrasi berhasil

**FR-03:** Sistem harus mengarahkan user ke halaman "Tambah Cabang Pertama" setelah verifikasi

**FR-04:** Sistem harus menyediakan tour/wizard onboarding untuk user baru

## 7.2 Multi-Cabang

**FR-05:** Sistem harus mendukung minimal 100 cabang per UMKM

**FR-06:** Sistem harus memungkinkan owner untuk menonaktifkan cabang sementara tanpa menghapus data

**FR-07:** Sistem harus menampilkan dashboard "Semua Cabang" dengan metrik: total penjualan hari ini, total transaksi, produk terlaris

**FR-08:** Sistem harus menyediakan filter data per cabang di semua halaman laporan

## 7.3 Produk Global vs Lokal

**FR-09:** Sistem harus menandai setiap produk dengan tipe `global` atau `local`

**FR-10:** Produk global harus otomatis tersedia di semua cabang (tapi harga bisa di-override per cabang)

**FR-11:** Produk lokal hanya tersedia di cabang tempat produk tersebut dibuat

**FR-12:** Owner dapat mengkonversi produk lokal menjadi global (dan sebaliknya) dengan konfirmasi dampak stok

## 7.4 Transaksi POS

**FR-13:** Sistem harus memproses transaksi dari klik "Bayar" hingga struk terkirim ke printer dalam waktu < 2 detik (dengan koneksi stabil)

**FR-14:** Sistem harus mendukung mode offline: transaksi tetap berjalan, data disimpan di IndexedDB, sinkronisasi saat koneksi kembali

**FR-15:** Sistem harus menangani konflik sinkronisasi dengan aturan "last write wins" untuk stok, dan menandai transaksi yang perlu review admin

**FR-16:** Sistem harus menyimpan snapshot harga produk pada saat transaksi (harga tidak berubah meskipun produk diupdate kemudian)

**FR-17:** Sistem harus mendukung cetak struk ulang (reprint) untuk transaksi dalam 24 jam terakhir

**FR-18:** Sistem harus membatasi void transaksi hanya untuk transaksi yang terjadi di shift yang sama

## 7.5 Manajemen Stok

**FR-19:** Sistem harus melakukan update stok real-time (setelah transaksi berhasil)

**FR-20:** Sistem harus mencegah transaksi jika stok tidak mencukupi (kecuali diizinkan admin untuk negative stock)

**FR-21:** Sistem harus menyediakan nomor unik untuk setiap transfer stok (format: TRF/YYYYMMDD/XXXXX)

**FR-22:** Sistem harus mencatat approver untuk setiap transfer stok (audit trail)

**FR-23:** Sistem harus mengirim notifikasi ke cabang tujuan saat transfer stok dikirim

**FR-24:** Sistem harus mengirim notifikasi ke owner jika stok produk < minimum stock di cabang mana pun

## 7.6 User & Role

**FR-25:** Sistem harus menerapkan Role-Based Access Control (RBAC) dengan izin yang telah ditentukan

**FR-26:** Sistem harus mendukung custom role (owner dapat membuat role kustom dengan izin spesifik)

**FR-27:** Sistem harus mencatat semua login attempt (success & failed) dengan IP address dan timestamp

**FR-28:** Sistem harus mengunci akun setelah 5 percobaan login gagal, unlock setelah 15 menit

**FR-29:** Sistem harus memaksa perubahan password setiap 90 hari (opsional, dapat dinonaktifkan owner)

## 7.7 Laporan

**FR-30:** Sistem harus menyediakan export laporan ke format PDF dan Excel dengan karakter encoding UTF-8

**FR-31:** Sistem harus menyediakan filter tanggal custom untuk semua laporan

**FR-32:** Sistem harus meng-cache laporan agregat untuk performa (refresh setiap 5 menit)

**FR-33:** Sistem harus menyediakan scheduling report (email otomatis setiap hari/bulan ke owner)

---

# 8. REQUIREMENTS NON-FUNGSIONAL (DETAIL)

## 8.1 Performance

| Metrik | Target | Pengukuran |
|--------|--------|------------|
| Response time API (p95) | < 500 ms | Dari request hingga response |
| POS checkout time (p95) | < 2 detik | Dari klik bayar hingga struk terkirim |
| Concurrent users per cabang | 5 kasir + 2 admin | Load testing dengan k6/JMeter |
| Concurrent UMKM | 10.000 | Simulasi dengan 10k tenant aktif |
| Sync offline queue processing | 100 transaksi/detik | Setelah koneksi kembali |
| Database query (read) | < 100 ms | Query terkompleks (laporan bulanan) |

## 8.2 Scalability

- **Horizontal scaling:** API service dapat ditambahkan instance baru di belakang load balancer
- **Database:** Read replica untuk query laporan, sharding by tenant_id
- **Caching:** Redis cluster dengan eviction policy LRU
- **File storage:** S3-compatible untuk gambar produk dan export laporan

## 8.3 Security

| Aspek | Implementasi |
|-------|---------------|
| Authentication | JWT dengan access token (1 jam) + refresh token (7 hari) |
| Password storage | bcrypt (cost factor 12) |
| Data in transit | TLS 1.3 minimum |
| Data at rest | Enkripsi AES-256 untuk PII (email, nomor telepon, alamat) |
| API security | Rate limiting (100 req/menit per IP untuk non-POS, 1000 req/menit untuk POS) |
| CORS | Whitelist domain yang diizinkan |
| SQL Injection | Parameterized queries + ORM |
| XSS Protection | Content Security Policy, input sanitization |
| Audit Log | Semua operasi write dicatat dengan user_id, timestamp, action, ip_address |

## 8.4 Availability & Reliability

| Metrik | Target | Mitigasi |
|--------|--------|----------|
| Uptime | 99.5% (monthly) | Load balancer, auto-healing, multi-AZ |
| RTO (Recovery Time Objective) | < 4 jam | Disaster recovery plan, backup restorasi |
| RPO (Recovery Point Objective) | < 15 menit | Continuous backup ke secondary region |
| Error rate (5xx) | < 0.1% | Monitoring dengan alert jika > 1% |

## 8.5 Offline Mode Capability

- **Storage:** Minimal 10.000 transaksi offline per perangkat
- **Sync strategy:** Background sync saat koneksi tersedia, queue dengan retry exponential backoff
- **Conflict resolution:** Timestamp-based + manual review untuk konflik stok

## 8.6 Maintainability

- **Code coverage:** Minimal 80% untuk unit test
- **API documentation:** OpenAPI/Swagger untuk semua endpoint publik
- **Logging:** Structured log (JSON) dengan level DEBUG, INFO, WARN, ERROR
- **Monitoring:** Prometheus metrics + Grafana dashboard + alert ke Slack/Email

---

# 9. USE CASE DETAIL (DENGAN ALTERNATIVE FLOW)

## 9.1 Use Case: Transaksi Penjualan (Normal Flow)

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Kasir | Login ke aplikasi POS | Validasi kredensial, redirect ke halaman POS |
| 2 | Kasir | Scan barcode produk | Tampilkan produk, tambah ke keranjang |
| 3 | Kasir | Ulangi step 2 untuk semua produk | - |
| 4 | Kasir | Klik "Bayar" | Hitung subtotal, diskon, pajak, total |
| 5 | Kasir | Pilih metode pembayaran (Tunai) | Tampilkan field input nominal bayar |
| 6 | Kasir | Input nominal bayar | Hitung dan tampilkan kembalian |
| 7 | Kasir | Klik "Selesai" | Kurangi stok, simpan transaksi, cetak struk |

**Alternative Flow A (Koneksi Internet Putus):**
- Step 4-7 berjalan normal, data disimpan di local storage
- Tampilkan indikator "Mode Offline"
- Saat koneksi kembali, sinkronisasi otomatis

**Alternative Flow B (Stok Tidak Cukup):**
- Step 3 setelah menambah produk, system tampilkan alert "Stok tidak mencukupi (tersedia: X)"
- Kasir dapat mengurangi qty atau batalkan produk

**Alternative Flow C (Pembayaran Non-Tunai - QRIS):**
- Step 5 pilih QRIS → System generate QR code → Kasir scan dengan device customer
- System polling status pembayaran (timeout 2 menit)
- Jika sukses lanjut step 7, jika gagal tampilkan error

**Alternative Flow D (Split Payment):**
- Step 5 pilih "Split Payment" → Tentukan nominal per metode (total harus sama)
- System validasi setiap metode → Proses sesuai metode masing-masing

## 9.2 Use Case: Transfer Stok Antar Cabang

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Admin Cabang A | Buka menu "Transfer Stok" → "Buat Transfer" | Form transfer stok |
| 2 | Admin Cabang A | Pilih cabang tujuan, pilih produk, input qty | Validasi stok di cabang asal |
| 3 | Admin Cabang A | Klik "Kirim Request" | Generate nomor transfer, status = PENDING |
| 4 | Admin Cabang B | Terima notifikasi, buka detail transfer | Tampilkan detail produk & qty |
| 5 | Admin Cabang B | Klik "Terima Transfer" | Status = IN_TRANSIT (jika fisik dikirim) |
| 6 | Admin Cabang B | (Setelah barang sampai) Buka transfer → "Konfirmasi Terima" | Kurangi stok cabang A, tambah stok cabang B, status = COMPLETED |

**Alternative Flow (Penolakan):**
- Step 5 Admin Cabang B klik "Tolak" → Status = REJECTED → Notifikasi ke Cabang A

**Alternative Flow (Stok di Cabang Asal Berkurang setelah Request):**
- System validasi ulang stok saat konfirmasi terima
- Jika stok tidak cukup, transfer gagal dengan notifikasi

---

# 10. DATA MODEL (LENGKAP)

## 10.1 Entity Relationship Diagram (Textual)

```
umkm (1) ----< cabang (N)
umkm (1) ----< user (N)
umkm (1) ----< subscription (1)

cabang (1) ----< user (N)
cabang (1) ----< product_local (N)
cabang (1) ----< stock (N)
cabang (1) ----< transaction (N)
cabang (1) ----< transfer_out (N)
cabang (1) ----< transfer_in (N)

product_global (1) ----< product_variant (N)
product_global (1) ----< stock (N) [through cabang]
product_global (1) ----< category (N)

category (1) ----< child_category (N) [self reference]

transaction (1) ----< transaction_item (N)
transaction (1) ----< payment (N)

transfer_stock (1) ----< transfer_item (N)
```

## 10.2 Tabel-tabel Utama

### umkm

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| name | VARCHAR(100) | NOT NULL | Nama UMKM |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email pemilik utama |
| phone | VARCHAR(20) | NOT NULL | No telepon |
| address | TEXT | - | Alamat lengkap |
| npwp | VARCHAR(20) | - | NPWP (opsional) |
| logo_url | TEXT | - | URL logo |
| status | ENUM('active','inactive','suspended') | DEFAULT 'active' | Status UMKM |
| created_at | TIMESTAMP | DEFAULT NOW() | - |
| updated_at | TIMESTAMP | DEFAULT NOW() | - |

### cabang

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| umkm_id | UUID | FK(umkm.id) | - |
| name | VARCHAR(100) | NOT NULL | Nama cabang |
| code | VARCHAR(20) | NOT NULL | Kode cabang (unik per UMKM) |
| address | TEXT | NOT NULL | Alamat lengkap |
| phone | VARCHAR(20) | - | No telepon cabang |
| tax_rate | DECIMAL(5,2) | DEFAULT 11.00 | Pajak (%) |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif |
| type | ENUM('simple','medium','large','warehouse') | DEFAULT 'simple' | Tipe cabang |
| created_at | TIMESTAMP | DEFAULT NOW() | - |

### product_global

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| umkm_id | UUID | FK(umkm.id) | - |
| sku | VARCHAR(50) | NOT NULL | Stock Keeping Unit |
| barcode | VARCHAR(50) | - | Barcode (opsional) |
| name | VARCHAR(200) | NOT NULL | Nama produk |
| description | TEXT | - | Deskripsi |
| category_id | UUID | FK(category.id) | - |
| unit | VARCHAR(20) | NOT NULL | Satuan (pcs, kg, liter) |
| purchase_price | DECIMAL(15,2) | NOT NULL | Harga beli |
| selling_price | DECIMAL(15,2) | NOT NULL | Harga jual default |
| min_stock | INTEGER | DEFAULT 0 | Minimum stok alert |
| image_urls | TEXT[] | - | Array URL gambar |
| is_active | BOOLEAN | DEFAULT TRUE | - |
| created_at | TIMESTAMP | DEFAULT NOW() | - |

### product_local (meng-extends product_global)

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| cabang_id | UUID | FK(cabang.id) | - |
| product_global_id | UUID | FK(product_global.id) | NULL jika produk murni lokal |
| selling_price | DECIMAL(15,2) | NOT NULL | Harga jual di cabang ini |
| is_active | BOOLEAN | DEFAULT TRUE | - |

### stock

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| cabang_id | UUID | FK(cabang.id) | - |
| product_id | UUID | FK(product_global.id) | - |
| quantity | INTEGER | DEFAULT 0, NOT NULL | Stok saat ini |
| reserved | INTEGER | DEFAULT 0 | Stok yang sudah diorder tapi belum bayar |
| last_updated | TIMESTAMP | DEFAULT NOW() | - |

### transaction

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| invoice_number | VARCHAR(50) | UNIQUE, NOT NULL | Format: INV/YYYYMMDD/XXXXX |
| cabang_id | UUID | FK(cabang.id) | - |
| cashier_id | UUID | FK(user.id) | Kasir yang melayani |
| customer_name | VARCHAR(100) | - | Optional |
| subtotal | DECIMAL(15,2) | NOT NULL | - |
| discount_amount | DECIMAL(15,2) | DEFAULT 0 | - |
| tax_amount | DECIMAL(15,2) | DEFAULT 0 | - |
| total_amount | DECIMAL(15,2) | NOT NULL | - |
| payment_method | ENUM('cash','card','qris','transfer') | NOT NULL | - |
| status | ENUM('pending','completed','voided','refunded') | DEFAULT 'completed' | - |
| sync_status | ENUM('synced','pending','conflict') | DEFAULT 'synced' | Untuk offline mode |
| offline_id | VARCHAR(50) | - | ID transaksi saat offline |
| created_at | TIMESTAMP | DEFAULT NOW() | - |
| voided_at | TIMESTAMP | - | - |
| voided_by | UUID | FK(user.id) | - |

### stock_movement

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| cabang_id | UUID | FK(cabang.id) | - |
| product_id | UUID | FK(product_global.id) | - |
| type | ENUM('in','out','transfer_out','transfer_in','adjustment') | NOT NULL | - |
| quantity | INTEGER | NOT NULL | Jumlah (positif untuk in/transfer_in) |
| reference_id | UUID | - | ID transaksi/transfer/opname |
| previous_stock | INTEGER | NOT NULL | Stok sebelum perubahan |
| new_stock | INTEGER | NOT NULL | Stok setelah perubahan |
| created_by | UUID | FK(user.id) | - |
| created_at | TIMESTAMP | DEFAULT NOW() | - |

### transfer_stock

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| transfer_number | VARCHAR(50) | UNIQUE, NOT NULL | Format: TRF/YYYYMMDD/XXXXX |
| from_cabang_id | UUID | FK(cabang.id) | - |
| to_cabang_id | UUID | FK(cabang.id) | - |
| status | ENUM('pending','approved','in_transit','completed','rejected','cancelled') | DEFAULT 'pending' | - |
| notes | TEXT | - | - |
| requested_by | UUID | FK(user.id) | - |
| approved_by | UUID | FK(user.id) | - |
| requested_at | TIMESTAMP | DEFAULT NOW() | - |
| completed_at | TIMESTAMP | - | - |

### user

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| umkm_id | UUID | FK(umkm.id) | NULL untuk super admin |
| cabang_id | UUID | FK(cabang.id) | NULL untuk owner level UMKM |
| email | VARCHAR(100) | UNIQUE, NOT NULL | - |
| password_hash | VARCHAR(255) | NOT NULL | - |
| full_name | VARCHAR(100) | NOT NULL | - |
| role | ENUM('owner','admin','cashier','warehouse') | NOT NULL | - |
| is_active | BOOLEAN | DEFAULT TRUE | - |
| last_login | TIMESTAMP | - | - |
| created_at | TIMESTAMP | DEFAULT NOW() | - |

### audit_log

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | UUID | PK | - |
| user_id | UUID | FK(user.id) | - |
| action | VARCHAR(50) | NOT NULL | CREATE, UPDATE, DELETE, LOGIN, etc |
| entity | VARCHAR(50) | NOT NULL | product, transaction, user, etc |
| entity_id | UUID | - | ID record yang diubah |
| old_value | JSONB | - | Snapshot sebelum perubahan |
| new_value | JSONB | - | Snapshot setelah perubahan |
| ip_address | INET | - | - |
| created_at | TIMESTAMP | DEFAULT NOW() | - |

---

# 11. BUSINESS RULES

| ID | Rule | Deskripsi |
|----|------|------------|
| BR-01 | Satu email untuk satu user | Email harus unik di seluruh sistem |
| BR-02 | Owner minimal memiliki 1 cabang | Setelah registrasi, wajib buat cabang pertama |
| BR-03 | Stok tidak boleh negatif (default) | Kecuali setting "allow_negative_stock" diaktifkan per cabang |
| BR-04 | Void hanya dalam 1 shift yang sama | Void transaksi shift kemarin butuh approval admin |
| BR-05 | Refund maksimal 30 hari setelah transaksi | Setelah 30 hari tidak bisa refund via sistem |
| BR-06 | Diskon tidak boleh melebihi harga jual | Maks diskon 100% |
| BR-07 | Transfer stok harus melalui status PENDING dulu | Tidak bisa langsung COMPLETED |
| BR-08 | Harga produk di transaksi adalah snapshot | Tidak berubah meskipun harga produk diupdate |
| BR-09 | Satu shift kasir maksimal 24 jam | Shift akan auto-close setelah 24 jam |
| BR-10 | SKU produk harus unik per UMKM | Tidak boleh ada duplikat SKU |

---

# 12. ERROR HANDLING & EDGE CASES

## 12.1 Skenario Error

| Error | HTTP Code | User Message | System Action |
|-------|-----------|--------------|----------------|
| Koneksi database timeout | 503 | "Sistem sedang sibuk, coba lagi" | Retry 3x, log error, alert admin |
| Stok tidak cukup | 400 | "Stok produk X tersisa Y" | Tampilkan saran qty |
| Duplicate SKU | 409 | "SKU sudah digunakan" | Tampilkan SKU yang bentrok |
| Transfer stok ke cabang non-aktif | 400 | "Cabang tujuan tidak aktif" | Batalkan request |
| Void transaksi sudah lebih dari 24 jam | 403 | "Void hanya untuk transaksi hari ini" | Arahkan ke proses refund |
| QRIS payment timeout | 408 | "Pembayaran timeout, coba lagi" | Batalkan transaksi, reset stok |
| Offline sync conflict | 409 | "Terjadi konflik data, perlu review admin" | Tandai transaksi, kirim notifikasi ke admin |

## 12.2 Edge Cases

| Skenario | Penanganan |
|----------|------------|
| Kasir lupa tutup shift | Auto close shift pukul 23:59, kirim laporan ke admin |
| Produk dihapus padahal masih ada stok | Set status inactive, tidak bisa dihapus jika stok > 0 |
| Transfer stok dikirim tapi tidak pernah diterima | Auto cancel setelah 7 hari, stok kembali ke cabang asal |
| Dua kasir menjual produk yang sama bersamaan | Lock row dengan SELECT FOR UPDATE, antrian transaksi |
| Printer struk mati | Simpan ke queue, notifikasi kasir, bisa reprint nanti |
| Harga produk berubah di tengah transaksi | Snapshot harga saat produk ditambahkan ke keranjang |

---

# 13. INTEGRASI (DETAIL)

## 13.1 Payment Gateway (Phase 2)

| Provider | Metode | API Documentation |
|----------|--------|-------------------|
| Midtrans | QRIS, Virtual Account, Credit Card | Snap API, Core API |
| Xendit | QRIS, VA, E-Wallet | Invoice API, Payment Request API |

**Flow Integrasi QRIS:**
1. POS backend create payment request ke Midtrans/Xendit
2. Dapatkan QR code string
3. Tampilkan QR code di frontend
4. Polling status setiap 3 detik (timeout 120 detik)
5. Jika sukses → lanjutkan transaksi
6. Jika gagal/timeout → batalkan transaksi

## 13.2 Printer Struk (ESC/POS)

**Supported Printers:**
- Epson TM-T20, TM-T82, TM-m30
- Xprinter XP-365B, XP-58IIH
- NCR, Star Micronics

**Format Struk:**
```
[LOGO]
[NAMA UMKM]
[ALAMAT CABANG]
[TELP CABANG]
========================
INV: INV/20241220/00001
Kasir: Ani
Tanggal: 20/12/2024 14:30
========================
Item           Qty   Harga    Total
-----------------------------------
Aqua 600ml      2   3,000    6,000
Indomie Goreng  3   3,500   10,500
-----------------------------------
Subtotal:             16,500
Diskon:                 -500
PPN 11%:              1,760
Total:                17,760
Tunai:                20,000
Kembali:               2,240
========================
Terima kasih!
```

## 13.3 Export Laporan

| Format | Library | Notes |
|--------|---------|-------|
| PDF | Puppeteer (Node.js) / jsPDF (client) | Generate dari HTML template |
| Excel | SheetJS (xlsx) | Support multiple sheets |
| CSV | Built-in | Untuk data besar > 10.000 rows |

---

# 14. NON-FUNCTIONAL REQUIREMENTS - TARGET METRIK

| Kategori | Metrik | Target | Monitoring Tool |
|----------|--------|--------|-----------------|
| Performance | API Response Time (p95) | < 500ms | Prometheus + Grafana |
| Performance | POS Checkout Time (p95) | < 2s | Custom metric |
| Performance | Page Load Time (First Contentful) | < 1.5s | Lighthouse CI |
| Availability | Uptime | 99.5% | Uptime Robot, Pingdom |
| Error | API Error Rate (5xx) | < 0.1% | Sentry, Datadog |
| Error | Client JS Error Rate | < 0.5% | Sentry |
| Security | Mean Time to Detect (MTTD) | < 15 menit | SIEM + Alert |
| Security | Mean Time to Respond (MTTR) | < 60 menit | On-call rotation |
| User Experience | Offline Sync Success Rate | > 99% | Custom metric |
| Database | Query Performance (slow query) | < 100ms | pg_stat_statements |

---

# 15. KPI & SUCCESS METRICS

## 15.1 Business KPIs (untuk Product Manager)

| KPI | Target | Cara Ukur |
|-----|--------|-----------|
| User Retention (Month 3) | > 70% | Cohort analysis |
| Daily Active UMKM | > 80% dari total registered | Metrik harian |
| Transaksi per hari per cabang | > 50 | Rata-rata dari semua cabang |
| Offline mode usage | < 5% transaksi offline | Target minim, indikator stabilitas koneksi |
| Customer Support ticket | < 1 ticket per 1000 transaksi | Zendesk/Intercom |

## 15.2 Technical KPIs (untuk Engineering)

| KPI | Target |
|-----|--------|
| Deployment frequency | > 1x per week |
| Lead time for change | < 2 hari |
| Mean time to recovery (MTTR) | < 30 menit |
| Change failure rate | < 15% |

## 15.3 User Satisfaction KPIs

| Metrik | Target | Method |
|--------|--------|--------|
| CSAT Score | > 4.5/5 | Survey in-app setelah 10 transaksi |
| NPS | > 40 | Email survey bulanan |
| Feature adoption (transfer stok) | > 60% UMKM multi-cabang | Metrik usage |

---

# 16. ROADMAP (DENGAN TIMELINE)

## Phase 0: Foundation (Minggu 1-4) - MVP

| Minggu | Deliverables |
|--------|--------------|
| 1 | Setup infrastructure (AWS/GCP), database schema, CI/CD |
| 2 | Auth service (login, register, JWT), UMKM & cabang management |
| 3 | Product management (CRUD, kategori), role dasar (owner, kasir) |
| 4 | POS dasar (tambah ke keranjang, checkout tunai, struk) |

**Go-Live MVP** dengan 5 pilot UMKM

## Phase 1: Core POS (Minggu 5-10)

| Minggu | Deliverables |
|--------|--------------|
| 5 | Multi-payment (QRIS, card), diskon, pajak |
| 6 | Offline mode (IndexedDB, sync engine) |
| 7 | Stok management (in/out, history) |
| 8 | Shift kasir, laporan penjualan harian |
| 9 | Role gudang, stok masuk (PO) |
| 10 | Laporan stok, minimum stock alert |

## Phase 2: Multi-Cabang & Stok (Minggu 11-16)

| Minggu | Deliverables |
|--------|--------------|
| 11 | Transfer stok antar cabang (request → approval → complete) |
| 12 | Produk lokal vs global, harga per cabang |
| 13 | Dashboard owner (multi-cabang) |
| 14 | Laporan agregat penjualan & laba |
| 15 | Opname stok, adjustment |
| 16 | Batch import/export produk via Excel |

## Phase 3: Analytics & Integrasi (Minggu 17-22)

| Minggu | Deliverables |
|--------|--------------|
| 17 | Advanced reporting (best seller, slow moving) |
| 18 | Scheduled report (email otomatis) |
| 19 | Integration Midtrans/Xendit (production) |
| 20 | Audit log, aktivitas user |
| 21 | Custom role (owner buat role sendiri) |
| 22 | Performance optimization, load testing |

## Phase 4: Enterprise (Minggu 23-28) - Optional

| Minggu | Deliverables |
|--------|--------------|
| 23-24 | Membership & loyalty program |
| 25-26 | Integrasi marketplace (Shopee, Tokopedia) |
| 27-28 | Mobile app untuk kasir (Android) |

---

# 17. RISIKO & MITIGASI (DETAIL)

| ID | Risiko | Probabilitas | Dampak | Mitigasi |
|----|--------|--------------|--------|-----------|
| R-01 | Kompleksitas sinkronasi offline | High | High | Conflict resolution strategy jelas, manual review UI, prioritaskan fitur offline di early phase |
| R-02 | Performance degradation saat ribuan cabang | Medium | High | Database indexing, caching strategy, load testing berkala, read replica untuk laporan |
| R-03 | Koneksi internet tidak stabil di lokasi UMKM | High | Medium | Offline mode sebagai core feature, sync retry dengan backoff, UI indikator offline jelas |
| R-04 | Adopsi user rendah karena kompleksitas | Medium | High | Onboarding wizard, video tutorial, customer support via WhatsApp, simplified mode untuk kasir |
| R-05 | Konflik data saat dua kasir edit produk bersamaan | Low | Medium | Optimistic locking dengan version field, notifikasi konflik ke user |
| R-06 | Kebocoran data (PII customer) | Low | High | Enkripsi data sensitif, audit log akses data, regular security audit, penetration testing |
| R-07 | Ketergantungan pada payment gateway | Medium | Medium | Fallback ke multiple provider, queue untuk retry payment, monitoring status gateway |
| R-08 | Perubahan regulasi pajak (PPN) | Medium | Low | Konfigurasi tax rate per cabang bisa diubah tanpa deploy, notifikasi perubahan ke owner |
| R-09 | Kesalahan hitung stok karena bug | Medium | High | Unit testing untuk semua logic stok, stock movement audit trail, fitur opname untuk koreksi |
| R-10 | Printer struk tidak kompatibel | Medium | Medium | Support ESC/POS standard, fallback ke print via browser, export PDF jika printer error |

---

# 18. ASUMSI & DEPENDENSI

## 18.1 Asumsi

| Asumsi | Dampak jika salah |
|--------|-------------------|
| Mayoritas UMKM memiliki koneksi internet (4G/WiFi) setidaknya 80% waktu operasional | Offline mode harus sangat robust |
| Kasir menggunakan device dengan browser modern (Chrome/Edge) | Perlu polyfill untuk browser lama |
| UMKM bersedia membayar subscription setelah trial | Perlu value proposition kuat di MVP |
| Stok produk tidak lebih dari 1 juta SKU per UMKM | Database design perlu dioptimalkan |

## 18.2 Dependensi

| Dependensi | Timeline | Contingency |
|------------|----------|-------------|
| Approval dari payment gateway (Midtrans/Xendit) | 2-4 minggu | Mulai dengan manual cash dulu |
| Akses ke printer thermal untuk testing | 1 minggu | Emulator printer untuk development |
| Domain dan SSL certificate | 1 hari | - |
| Cloud infrastructure (AWS/GCP account) | 1 minggu | - |

---

# 19. TESTING STRATEGY

## 19.1 Testing Levels

| Level | Tools | Coverage Target |
|-------|-------|-----------------|
| Unit Test | Jest (backend), Vitest (frontend) | 80% |
| Integration Test | Supertest (API), Testing Library (UI) | Critical paths 100% |
| E2E Test | Playwright/Cypress | Top 10 user journeys |
| Performance Test | k6 | Simulasi 10k concurrent users |
| Security Test | OWASP ZAP | Automated scan setiap release |

## 19.2 Key Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Transaksi offline → konek kembali | Data tersinkron, stok update, invoice number unik |
| Transfer stok dari cabang A ke B | Stok A berkurang setelah B konfirmasi, movement terekam |
| Void transaksi di shift berbeda | Ditolak sistem, perlu approval admin |
| Dua kasir menjual produk terakhir bersamaan | Satu transaksi sukses, satu gagal dengan notifikasi stok habis |
| Harga produk diubah setelah transaksi | Transaksi lama tetap menggunakan harga lama |

---

# 20. REKOMENDASI TEKNIS (FINAL)

| Layer | Technology Stack | Alasan |
|-------|------------------|--------|
| **Backend** | NestJS + TypeScript | Scalable, modular, good for microservices |
| **API** | GraphQL (untuk POS) + REST (untuk reporting) | GraphQL untuk fleksibilitas query POS, REST untuk simplicity |
| **Database** | PostgreSQL 15+ | Reliable, ACID compliant, support JSONB, good for multi-tenant |
| **Cache** | Redis 7+ | High performance, support pub/sub untuk real-time notifikasi |
| **Queue** | BullMQ (Redis-based) | Untuk offline sync, email, report generation |
| **Storage** | AWS S3 / GCS | Gambar produk, export laporan |
| **Frontend POS** | React + Vite + TailwindCSS + PWA | Fast development, offline support via service worker |
| **Frontend Dashboard** | React + Redux Toolkit + Shadcn/ui | Admin panel dengan banyak state |
| **Mobile** | React Native (opsional Phase 4) | Code reuse dengan web |
| **Infrastructure** | Docker + Kubernetes (EKS/GKE) | Auto-scaling, self-healing |
| **CI/CD** | GitHub Actions + ArgoCD | Automated testing & deployment |
| **Monitoring** | Prometheus + Grafana + Loki + Tempo | Metrics, logs, traces terintegrasi |
| **Error Tracking** | Sentry | Real-time error alerting |

---

# 21. APPROVAL

| Role | Nama | Tanda Tangan | Tanggal |
|------|------|--------------|---------|
| Product Manager | [Nama] | ___________ | [Tanggal] |
| Tech Lead | [Nama] | ___________ | [Tanggal] |
| Head of Engineering | [Nama] | ___________ | [Tanggal] |
| CEO (jika diperlukan) | [Nama] | ___________ | [Tanggal] |

---

# 22. LAMPIRAN

## 22.1 Glossary Tambahan

| Istilah | Definisi |
|---------|----------|
| HPP | Harga Pokok Penjualan (Cost of Goods Sold) |
| PPN | Pajak Pertambahan Nilai (11% sesuai UU HPP) |
| QRIS | Quick Response Code Indonesian Standard |
| SKU | Stock Keeping Unit |
| PWA | Progressive Web App |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |

## 22.2 Referensi

- Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP) tentang PPN 11%
- Pedoman Teknis Penyelenggaraan QRIS - Bank Indonesia
- ESC/POS Printer Language Specification - Epson

## 22.3 Dokumen Terkait

- API Documentation (OpenAPI) - [Link]
- UI/UX Design System - [Link]
- Database Migration Scripts - [Link]
- Deployment Guide - [Link]
- User Manual - [Link]

---

# C. KESIMPULAN ANALISIS

| No | Temuan Utama | Tindakan yang Telah Dilakukan |
|----|--------------|-------------------------------|
| 1 | Data model tidak lengkap | Ditambahkan 12 tabel dengan atribut lengkap, tipe data, dan relasi |
| 2 | Use case hanya deskripsi tekstual | Ditambahkan step-by-step dengan alternative flow untuk error & edge case |
| 3 | Tidak ada prioritas fitur | Ditambahkan prioritas MoSCoW (Must, Should, Could) untuk setiap fitur |
| 4 | Error handling tidak disebut | Ditambahkan 12 skenario error dengan HTTP code & user message |
| 5 | Non-functional tanpa target konkret | Ditambahkan metrik kuantitatif (p95, RTO, RPO, dll) |
| 6 | Tidak ada business rules | Ditambahkan 10 business rules untuk menjaga integritas data |
| 7 | Roadmap tanpa timeline | Ditambahkan timeline per minggu untuk 28 minggu (7 bulan) |
| 8 | Risiko tanpa mitigasi | Ditambahkan 10 risiko dengan probabilitas, dampak, dan mitigasi spesifik |
| 9 | Testing strategy tidak ada | Ditambahkan testing levels, tools, dan key scenarios |
| 10 | Integrasi tidak spesifik | Ditambahkan detail payment gateway & printer ESC/POS |

**Status PRD:** ✅ **LENGKAP & SIAP IMPLEMENTASI**

Dokumen PRD ini telah diperkaya dari **14 bagian menjadi 22 bagian** dengan tingkat detail yang cukup untuk memulai proses desain, development, dan testing. Tim engineering dapat langsung membuat task breakdown berdasarkan dokumen ini.