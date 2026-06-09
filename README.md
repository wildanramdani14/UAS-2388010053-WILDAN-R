# 🚀 UAS Administrasi Server – MultiApp System Deployment

Sistem ini terdiri dari dua aplikasi:
1. **Web Statis**: Website Curriculum Vitae (CV) Wildan Ramdani yang disajikan via Nginx di Port 80.
2. **Web Dinamis**: Aplikasi Manajemen Perpustakaan Digital berbasis Next.js 14 & MariaDB yang berjalan di Port 3000.

---

## 🗺️ Topologi Arsitektur & Alur Jaringan

Berikut adalah diagram arsitektur deployment menggunakan Docker Compose di AWS EC2 Instance:

```mermaid
graph TD
    User([User Browser])
    
    subgraph AWS EC2 Instance
        subgraph Docker Bridge Network: perpus_net
            statis[Web Statis Container: Nginx]
            dinamis[Web Dinamis Container: Next.js Standalone]
            db[(Database Container: MariaDB)]
        end
    end

    User -->|Port 80: HTTP| statis
    User -->|Port 3000: Next.js| dinamis
    dinamis -->|Internal DNS 'database' Port 3306| db
```

---

## ⚙️ Variabel Lingkungan (Environment Variables)

Aplikasi Web Dinamis dikonfigurasi menggunakan variabel lingkungan berikut di dalam `docker-compose.yml`:

| Variabel | Deskripsi / Nilai |
| :--- | :--- |
| `DATABASE_HOST` | Hostname kontainer MariaDB (`database`). Menggunakan DNS internal Docker. |
| `DATABASE_USER` | Username untuk koneksi database (`perpustakaan_user`). |
| `DATABASE_PASSWORD`| Password untuk koneksi database (`perpustakaan_pass`). |
| `DATABASE_NAME` | Nama database utama (`perpustakaan`). |
| `NEXTAUTH_URL` | URL dasar autentikasi (diisi dengan `http://<IP_AWS>:3000`). |

> [!CAUTION]
> Port database `3306` **tidak diekspos ke publik** (no host port mapping) demi alasan keamanan infrastruktur. Hanya kontainer Next.js yang dapat mengakses database melalui jaringan internal docker (`perpus_net`).

---

## 📂 Automasi & Inisialisasi Database

Skema tabel database dan data awal (seeding) otomatis di-import saat pertama kali container dijalankan melalui folder inisialisasi MariaDB:
- File SQL lokal: `db/init.sql`
- Target mapping volume di container: `/docker-entrypoint-initdb.d/init.sql`

Secara otomatis, data pengguna dummy dan katalog buku berikut akan di-import ke MariaDB:
- **Admin**: `admin@perpus.com` (password: `admin123`)
- **User**: `budi@example.com` (password: `user123`)

---

## 🤖 Konfigurasi CI/CD Pipeline (GitHub Actions)

Repositori ini dikonfigurasi dengan teknik **Paths Filter** menggunakan dua workflow terpisah untuk menghemat resource runner dan mencegah pemborosan resource build:

### 1. Web Statis Pipeline (`.github/workflows/static-deploy.yml`)
- **Pemicu**: Modifikasi file di dalam folder `Web-Statis/**` atau file workflow ini.
- **Tugas**: Menyalin file static langsung ke direktori deployment di EC2 menggunakan SCP.

### 2. Web Dinamis Pipeline (`.github/workflows/dynamic-deploy.yml`)
- **Pemicu**: Modifikasi file di dalam folder `Web-Dinamis/**`, `db/**`, file `docker-compose.yml`, atau file workflow ini.
- **Tugas**: 
  1. Build Docker image Next.js standalone.
  2. Push image ke Docker Hub.
  3. SSH ke AWS EC2, tarik image terbaru dari Docker Hub (`docker compose pull`).
  4. Lakukan restart container (`docker compose up -d`).

### 🔑 GitHub Secrets yang Diperlukan
Untuk menjalankan pipeline ini dengan sukses, konfigurasikan Secrets berikut di repositori GitHub Anda (`Settings > Secrets and variables > Actions`):

| Nama Secret | Deskripsi |
| :--- | :--- |
| `EC2_HOST` | Alamat IP Publik AWS EC2 Anda. |
| `EC2_USERNAME` | Username SSH EC2 (contoh: `ubuntu` atau `ec2-user`). |
| `EC2_SSH_KEY` | Private Key SSH (`.pem` file content) untuk login ke EC2. |
| `DOCKER_USERNAME` | Username akun Docker Hub Anda. |
| `DOCKER_PASSWORD` | Password atau Access Token akun Docker Hub Anda. |

---

## 🚀 Panduan Menjalankan & Deployment

### Menjalankan secara Lokal dengan Docker Compose
1. Pastikan Docker Desktop telah berjalan di komputer Anda.
2. Jalankan perintah berikut di root project directory:
   ```bash
   docker compose up --build -d
   ```
3. Akses aplikasi di browser Anda:
   - Web Statis (CV): [http://localhost](http://localhost)
   - Web Dinamis (Next.js): [http://localhost:3000](http://localhost:3000)

### Uji Coba Deployment Otomatis (Zero-Touch Deployment)
1. Lakukan perubahan teks atau fitur kecil pada file lokal (misalnya mengubah teks pada CV atau Navbar perpustakaan).
2. Lakukan git commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "feat: update cv layout"
   git push origin main
   ```
3. Periksa tab **Actions** di repositori GitHub untuk melihat pipeline berjalan secara terisolasi berdasarkan path filter.
4. Setelah pipeline selesai (Centang Hijau), buka kembali halaman web di IP AWS Anda untuk melihat perubahan instan tanpa downtime!

---

## 🔗 Tautan Aplikasi (Live Test)
- **Web Statis (CV) [Port 80]**: http://47.131.81.207
- **Web Dinamis (Perpustakaan) [Port 3000]**: http://47.131.81.207:3000

---
*Dibuat oleh Wildan Ramdani untuk UAS Administrasi Server.*
