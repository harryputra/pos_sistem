# Panduan Penggunaan Antigravity POS

Selamat datang di Sistem POS UMKM Multi-Cabang Antigravity. Panduan ini dirancang untuk membantu Anda memahami fitur dan cara penggunaan sistem berdasarkan peran (role) masing-masing pengguna.

---

## Daftar Isi
1. [Panduan untuk Owner (Pemilik UMKM)](#1-panduan-untuk-owner-pemilik-umkm)
2. [Panduan untuk Admin Cabang](#2-panduan-untuk-admin-cabang)
3. [Panduan untuk Kasir](#3-panduan-untuk-kasir)
4. [Panduan untuk Staff Gudang](#4-panduan-untuk-staff-gudang)

---

## 1. Panduan untuk Owner (Pemilik UMKM)
Sebagai Owner, Anda memiliki akses penuh ke seluruh sistem dan data semua cabang.

### 1.1 Dashboard Utama
- **Melihat Performa:** Tinjau grafik pendapatan 7 hari terakhir dan perbandingan penjualan antar cabang.
- **Notifikasi Stok:** Periksa widget "Stok Menipis" untuk mengetahui produk mana yang perlu dipasok kembali di cabang tertentu.

### 1.2 Manajemen Cabang & Pengguna
- **Menambah Cabang:** Buka menu **Cabang** > Klik **Tambah Cabang**. Isi detail lokasi dan tipe cabang (Sederhana/Menengah/Besar/Gudang).
- **Mengelola Pengguna:** Buka menu **Pengguna** > Klik **Tambah Pengguna**. Anda dapat membuat Admin untuk cabang tertentu atau Staff tambahan.

### 1.3 Laporan & Analitik
- **Laporan Penjualan:** Gunakan menu **Laporan** untuk melihat total pendapatan, laba kotor, dan produk terlaris di seluruh ekosistem bisnis Anda.
- **Ekspor Data:** Klik tombol **Export PDF/Excel** untuk mendownload data laporan guna keperluan pembukuan.

### 1.4 Pengaturan Bisnis
- **Profil UMKM:** Di menu **Pengaturan**, Anda dapat mengubah nama bisnis, logo, dan alamat kantor pusat.

---

## 2. Panduan untuk Admin Cabang
Sebagai Admin Cabang, Anda bertanggung jawab atas operasional satu cabang tertentu.

### 2.1 Manajemen Produk & Harga
- **Menambah Produk:** Buka menu **Produk** > Klik **Tambah Produk**. Anda dapat menentukan SKU, kategori, dan harga jual spesifik untuk cabang Anda.
- **Update Harga:** Gunakan fitur override harga jika cabang Anda memerlukan harga yang berbeda dari harga global.

### 2.2 Kontrol Inventaris
- **Penerimaan Barang:** Buka **Stok** > **Stok Masuk**. Catat barang yang datang dari supplier untuk menambah stok sistem.
- **Opname Stok:** Lakukan hitung fisik secara berkala di menu **Stok Opname**. Masukkan jumlah fisik saat ini, dan sistem akan menghitung selisihnya secara otomatis.

### 2.3 Persetujuan Transfer
- **Transfer Masuk/Keluar:** Buka **Stok** > **Transfer Stok**. Di sini Anda dapat menyetujui (Approve) permintaan transfer dari cabang lain atau membuat permintaan baru.

---

## 3. Panduan untuk Kasir
Fokus utama Kasir adalah melayani transaksi pelanggan secara cepat.

### 3.1 Membuka & Menutup Shift
- **Buka Shift:** Sebelum memulai transaksi, buka menu **Shift** > Masukkan **Modal Awal** kas (misal: uang receh kembalian) > Klik **Buka Shift**.
- **Tutup Shift:** Di akhir jam kerja, klik **Tutup Shift**. Masukkan jumlah uang tunai yang ada di laci (Setoran Akhir). Sistem akan menghitung selisih jika ada ketidakcocokan dengan data transaksi.

### 3.2 Melakukan Penjualan (POS)
1. Buka menu **POS**.
2. **Cari Produk:** Ketik nama produk atau scan barcode.
3. **Atur Keranjang:** Ubah jumlah (qty) atau tambahkan diskon per item jika ada promo.
4. **Pembayaran:** Klik **Bayar**. Pilih metode (Tunai/QRIS/Kartu/Transfer).
5. **Cetak Struk:** Setelah sukses, klik **Cetak Struk** untuk pelanggan.

### 3.3 Riwayat & Pembatalan (Void)
- Jika pelanggan melakukan kesalahan setelah bayar, cari transaksi di menu **Transaksi** dan gunakan fitur **Void** (memerlukan izin Admin/Owner).

---

## 4. Panduan untuk Staff Gudang
Staff Gudang berfokus pada pergerakan barang dan akurasi stok fisik.

### 4.1 Manajemen Produk & Kategori
- Memastikan daftar produk selalu up-to-date dengan SKU yang benar.
- Mengatur kategori produk untuk memudahkan pencarian oleh Kasir.

### 4.2 Alur Transfer Barang
1. **Membuat Kiriman:** Jika ada perintah transfer, siapkan barang dan klik **Kirim** di menu Transfer.
2. **Menerima Barang:** Saat barang dari cabang lain sampai, periksa jumlah fisik dan klik **Konfirmasi Terima** di sistem agar stok bertambah.

### 4.3 Monitoring Riwayat Stok
- Gunakan menu **Log Pergerakan** untuk melacak kapan produk masuk, keluar, atau dikirim. Ini berguna untuk investigasi jika terjadi kehilangan barang.

---

## Tips Keamanan
- Jangan pernah membagikan password Anda kepada orang lain.
- Selalu **Tutup Shift** dan **Logout** jika Anda meninggalkan perangkat kasir/admin.
- Pastikan koneksi internet stabil untuk sinkronisasi data transaksi ke pusat. Jika offline, jangan hapus cache browser hingga data tersinkronisasi kembali.

---

## 5. Troubleshooting (Penyelesaian Masalah)

| Masalah | Solusi |
|---------|--------|
| **Lupa Password** | Hubungi Owner atau Admin Cabang Anda untuk reset password di menu Pengguna. |
| **Printer Tidak Mencetak** | Pastikan kabel printer terhubung dan status printer "Ready". Gunakan fitur **Reprint** jika perlu mencetak ulang. |
| **Data Stok Tidak Sinkron** | Pastikan perangkat terhubung ke internet. Tunggu beberapa saat hingga indikator "Sync" berubah menjadi hijau. |
| **Transaksi Ditolak (Stok Habis)** | Lakukan penambahan stok via menu **Stok Masuk** atau hubungi Gudang untuk transfer stok. |
| **Tidak Bisa Login** | Akun Anda mungkin dinonaktifkan sementara. Hubungi Owner untuk verifikasi status akun. |

---
*Antigravity POS - Solusi UMKM Berbasis Data*
