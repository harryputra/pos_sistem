# Panduan Instalasi & Konfigurasi (Untuk Mahasiswa)

Dokumen ini ditujukan untuk mahasiswa atau developer yang ingin menjalankan Sistem POS UMKM Multi-Cabang Antigravity di lingkungan lokal, server VPS, atau menggunakan Docker.

---

## 1. Persiapan Lingkungan (Prerequisites)
Sebelum memulai, pastikan perangkat Anda sudah terinstall:
- **Node.js** (Versi 18 atau lebih baru)
- **NPM** (Biasanya terinstall bersama Node.js)
- **PostgreSQL 15+** (Opsional jika tidak menggunakan Docker)
- **Docker & Docker Compose** (Sangat disarankan untuk kemudahan setup)

---

## 2. Instalasi Lokal (Tanpa Docker)

### Step 1: Clone Repository & Install Dependencies
1. Ekstrak file project ke folder pilihan Anda.
2. Buka terminal (CMD/PowerShell/Bash) di folder tersebut.
3. Jalankan perintah:
   ```bash
   npm install
   ```

### Step 2: Konfigurasi Database
1. Buka aplikasi database management Anda (seperti pgAdmin atau DBeaver).
2. Buat database baru bernama `pos_db`.
3. Jalankan isi file `database.sql` pada database tersebut untuk membuat tabel dan data awal.

### Step 3: Menjalankan Aplikasi
1. Jalankan perintah development:
   ```bash
   npm run dev
   ```
2. Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

---

## 3. Instalasi Menggunakan Docker (Rekomendasi)

Docker memudahkan Anda menjalankan aplikasi tanpa perlu menginstall database secara manual.

### Cara Menjalankan:
1. Pastikan Docker Desktop sudah aktif.
2. Di terminal folder project, jalankan:
   ```bash
   docker-compose up -d
   ```
3. Docker akan otomatis:
   - Membuat container database PostgreSQL.
   - Menjalankan `database.sql` secara otomatis.
   - Membangun (build) dan menjalankan aplikasi POS.
4. Akses aplikasi di [http://localhost:3000](http://localhost:3000).

---

## 4. Deployment ke Server VPS (Ubuntu/Linux)

Jika Anda ingin meng-online-kan project ini di VPS, ikuti langkah berikut:

### Metode PM2 (Production):
1. Install Node.js dan PM2 di server:
   ```bash
   sudo npm install -g pm2
   ```
2. Build project terlebih dahulu:
   ```bash
   npm run build
   ```
3. Jalankan dengan PM2:
   ```bash
   pm2 start npm --name "pos-system" -- start
   ```

### Menggunakan Nginx sebagai Reverse Proxy:
Konfigurasikan Nginx agar mengarah ke port 3000:
```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Tips & Troubleshooting
- **Error Port 3000:** Pastikan tidak ada aplikasi lain yang menggunakan port 3000. Jika ada, Anda bisa mengubah port di `package.json` atau Dockerfile.
- **Koneksi Database:** Jika running lokal tanpa Docker, pastikan kredensial di kode program sesuai dengan setting PostgreSQL Anda.
- **Zustand Persistence:** Data transaksi sementara disimpan di `localStorage` browser. Jika ingin menghapus data, silakan bersihkan cache browser atau gunakan fitur Logout.

---
*Selamat Belajar & Bereksperimen!*
