# Sporton Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-9.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

## 🚀 Tentang Proyek

**Sporton Backend** adalah RESTful API untuk aplikasi e-commerce peralatan olahraga. Dibangun dengan arsitektur modern menggunakan **Node.js**, **Express.js**, **TypeScript**, dan **MongoDB**. Proyek ini menerapkan best practices industri seperti modular architecture, comprehensive error handling, dan security middleware.

---

## 📋 Fitur Utama

| Feature                     | Deskripsi                                                        |
| --------------------------- | ---------------------------------------------------------------- |
| 🔐 **JWT Authentication**   | Sistem login yang aman dengan token berbasis waktu               |
| 📦 **Product Management**   | CRUD produk dengan upload gambar dan filtering                   |
| 🏷️ **Category System**      | Organisasi produk berdasarkan kategori dengan validasi referensi |
| 💳 **Transaction Handling** | Sistem checkout dengan bukti pembayaran dan atomic stock updates |
| 🏦 **Bank Management**      | Manajemen rekening bank untuk informasi pembayaran               |
| 🛡️ **Security Layers**      | Helmet, CORS, Rate Limiting terintegrasi                         |
| ⚡ **Input Validation**     | Comprehensive validation dengan pesan error yang jelas           |
| 🎯 **Global Error Handler** | Konsisten error response untuk semua jenis error                 |
| 📝 **Request Logging**      | Morgan logger untuk monitoring (development)                     |
| 🔄 **Graceful Shutdown**    | Proper handling untuk SIGTERM/SIGINT signals                     |

---

## 🛠️ Tech Stack

| Category             | Technology                       |
| -------------------- | -------------------------------- |
| **Runtime**          | Node.js 18+                      |
| **Framework**        | Express.js 5.x                   |
| **Language**         | TypeScript 5.x                   |
| **Database**         | MongoDB + Mongoose 9.x           |
| **Authentication**   | JWT (jsonwebtoken)               |
| **File Upload**      | Multer                           |
| **Security**         | Helmet, CORS, express-rate-limit |
| **Password Hashing** | bcrypt                           |
| **Logging**          | Morgan                           |

---

## 📁 Struktur Proyek

```
sporton-be/
├── src/
│   ├── config/                    # Konfigurasi terpusat aplikasi
│   │   └── index.ts               # Environment variables & constants
│   │
│   ├── controllers/               # Business logic handlers
│   │   ├── auth.controller.ts     # Login, register, profile
│   │   ├── bank.controller.ts     # Bank CRUD operations
│   │   ├── category.controller.ts # Category CRUD operations
│   │   ├── product.controller.ts  # Product CRUD + filtering
│   │   └── transaction.controller.ts # Checkout & status updates
│   │
│   ├── middlewares/               # Express middleware functions
│   │   ├── auth.middleware.ts     # JWT verification
│   │   ├── errorHandler.middleware.ts # Global error handler
│   │   ├── upload.middleware.ts   # Multer file upload config
│   │   └── validator.middleware.ts # Input validation rules
│   │
│   ├── models/                    # Mongoose schemas & interfaces
│   │   ├── bank.model.ts
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   ├── transaction.model.ts
│   │   └── user.model.ts
│   │
│   ├── routes/                    # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── bank.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   └── transaction.routes.ts
│   │
│   ├── utils/                     # Utility functions & classes
│   │   ├── ApiError.ts            # Custom error class
│   │   ├── asyncHandler.ts        # Async wrapper for controllers
│   │   └── response.ts            # Consistent response formatter
│   │
│   ├── app.ts                     # Express application setup
│   └── server.ts                  # Server entry point + graceful shutdown
│
├── uploads/                       # Uploaded files directory
├── dist/                          # Compiled JavaScript (production)
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Environment template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── sporton-api.postman_collection.json
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- **Node.js** versi 18 atau lebih tinggi
- **MongoDB** (local installation atau MongoDB Atlas)
- **pnpm** (recommended) atau npm/yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/your-username/sporton-be.git
cd sporton-be

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi Anda
```

### Konfigurasi Environment

Edit file `.env` dengan nilai yang sesuai:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/sporton

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d

# CORS (optional)
CORS_ORIGIN=*
```

### Menjalankan Server

```bash
# Development mode (dengan hot-reload)
pnpm dev

# Build untuk production
pnpm build

# Production mode
pnpm start
```

---

## 📚 API Endpoints

### System & Health

| Method | Endpoint | Deskripsi                      | Auth |
| ------ | -------- | ------------------------------ | ---- |
| GET    | `/`      | Health check                   | ❌   |
| GET    | `/api`   | API info & available endpoints | ❌   |

### Authentication

| Method | Endpoint                        | Deskripsi                          | Auth |
| ------ | ------------------------------- | ---------------------------------- | ---- |
| POST   | `/api/auth/initiate-admin-user` | Membuat admin pertama (one-time)   | ❌   |
| POST   | `/api/auth/signin`              | Login dan dapatkan JWT token       | ❌   |
| GET    | `/api/auth/me`                  | Mendapatkan profil user yang login | ✅   |

### Categories

| Method | Endpoint              | Deskripsi                            | Auth |
| ------ | --------------------- | ------------------------------------ | ---- |
| GET    | `/api/categories`     | Mendapatkan semua kategori           | ❌   |
| GET    | `/api/categories/:id` | Mendapatkan detail kategori          | ❌   |
| POST   | `/api/categories`     | Membuat kategori baru (dengan image) | ✅   |
| PUT    | `/api/categories/:id` | Memperbarui kategori                 | ✅   |
| DELETE | `/api/categories/:id` | Menghapus kategori\*                 | ✅   |

> \*Kategori tidak bisa dihapus jika masih ada produk yang menggunakannya

### Products

| Method | Endpoint                              | Deskripsi                          | Auth |
| ------ | ------------------------------------- | ---------------------------------- | ---- |
| GET    | `/api/products`                       | Mendapatkan semua produk           | ❌   |
| GET    | `/api/products?category=ID`           | Filter produk berdasarkan kategori | ❌   |
| GET    | `/api/products?search=keyword`        | Cari produk berdasarkan nama       | ❌   |
| GET    | `/api/products?minPrice=X&maxPrice=Y` | Filter produk berdasarkan harga    | ❌   |
| GET    | `/api/products/:id`                   | Mendapatkan detail produk          | ❌   |
| POST   | `/api/products`                       | Membuat produk baru                | ✅   |
| PUT    | `/api/products/:id`                   | Memperbarui produk                 | ✅   |
| DELETE | `/api/products/:id`                   | Menghapus produk                   | ✅   |

### Banks

| Method | Endpoint         | Deskripsi               | Auth |
| ------ | ---------------- | ----------------------- | ---- |
| GET    | `/api/banks`     | Mendapatkan semua bank  | ❌   |
| GET    | `/api/banks/:id` | Mendapatkan detail bank | ❌   |
| POST   | `/api/banks`     | Membuat akun bank baru  | ✅   |
| PUT    | `/api/banks/:id` | Memperbarui akun bank   | ✅   |
| DELETE | `/api/banks/:id` | Menghapus akun bank     | ✅   |

### Transactions

| Method | Endpoint                       | Deskripsi                           | Auth |
| ------ | ------------------------------ | ----------------------------------- | ---- |
| POST   | `/api/transactions/checkout`   | Membuat transaksi baru (checkout)   | ❌   |
| GET    | `/api/transactions`            | Mendapatkan semua transaksi         | ✅   |
| GET    | `/api/transactions?status=...` | Filter transaksi berdasarkan status | ✅   |
| GET    | `/api/transactions/:id`        | Mendapatkan detail transaksi        | ❌   |
| PUT    | `/api/transactions/:id`        | Memperbarui status transaksi        | ✅   |

> Status yang tersedia: `pending`, `paid`, `rejected`

---

## 🔒 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Validation error message"
  }
}
```

---

## 🧪 Tutorial Lengkap Testing dengan Postman

### Langkah 1: Import Collection

1. **Download dan Install Postman** dari [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. **Buka Postman**
3. Klik **File** → **Import**
4. Pilih file `sporton-api.postman_collection.json` dari folder project
5. Collection "Sporton API - Complete Collection" akan muncul di sidebar

### Langkah 2: Pastikan Server Berjalan

Sebelum testing, pastikan server sudah running:

```bash
cd sporton-be
pnpm dev
```

Anda akan melihat output:

```
🚀 Server is running on port 5001
📍 Environment: development
🌐 API URL: http://localhost:5001
```

### Langkah 3: Test Health Check

1. Di Postman, expand folder **"01. System & Health"**
2. Klik **"Health Check"**
3. Klik tombol **Send** (biru)
4. Anda akan melihat response:
   ```json
   {
     "success": true,
     "message": "Sporton API is running!",
     "environment": "development"
   }
   ```

### Langkah 4: Membuat Admin User (Pertama Kali)

> ⚠️ **Catatan**: Langkah ini hanya bisa dilakukan sekali saat database kosong

1. Expand folder **"02. Authentication"**
2. Klik **"Initiate Admin User"**
3. Lihat tab **Body** (sudah terisi):
   ```json
   {
     "name": "Admin Sporton",
     "email": "admin@sporton.com",
     "password": "Sporton123"
   }
   ```
4. Klik **Send**
5. Response sukses:
   ```json
   {
     "success": true,
     "message": "First Admin user created successfully!"
   }
   ```

### Langkah 5: Login dan Mendapatkan Token

1. Klik **"Login (Sign In)"**
2. Body sudah terisi:
   ```json
   {
     "email": "admin@sporton.com",
     "password": "Sporton123"
   }
   ```
3. Klik **Send**
4. Response:

   ```json
   {
     "success": true,
     "message": "Authentication successful",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": "...",
         "name": "Admin Sporton",
         "email": "admin@sporton.com"
       }
     }
   }
   ```

5. **✅ Token akan otomatis tersimpan** ke collection variable `TOKEN`

### Langkah 6: Mengakses Endpoint yang Memerlukan Auth

Setelah login, token sudah tersimpan. Untuk mengakses endpoint yang memerlukan autentikasi:

#### Metode A: Menggunakan Collection (Otomatis)

Collection sudah dikonfigurasi untuk menggunakan token otomatis. Cukup:

1. Klik request yang memerlukan Auth (contoh: **"Get Current User (Me)"**)
2. Klik **Send**
3. Response akan menampilkan profil user

#### Metode B: Setting Manual (Jika Token Tidak Tersimpan)

Jika token tidak tersimpan otomatis, lakukan ini:

1. **Copy token** dari response login (hanya bagian setelah `"token": "`)
2. Klik request yang ingin ditest
3. Pergi ke tab **Authorization**
4. Pilih **Type: Bearer Token**
5. Paste token di field **Token**
6. Klik **Send**

**ATAU menggunakan Header:**

1. Pergi ke tab **Headers**
2. Tambahkan:
   - **Key**: `Authorization`
   - **Value**: `Bearer <paste-token-disini>`

   Contoh Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

   > ⚠️ **Penting**: Ada **spasi** setelah kata "Bearer"

### Langkah 7: Workflow Testing Lengkap

Ikuti urutan ini untuk testing lengkap:

```
📋 URUTAN TESTING:

1. Health Check              → Pastikan server running
2. Initiate Admin User       → Buat admin (sekali saja)
3. Login                     → Dapatkan token (otomatis tersimpan)
4. Get Current User (Me)     → Test token berfungsi
5. Create Bank               → Buat akun bank
6. Create Category           → Buat kategori (dengan upload gambar)
7. Create Product            → Buat produk (dengan upload gambar)
8. Create Transaction        → Checkout (dengan upload bukti bayar)
9. Update Transaction Status → Konfirmasi pembayaran
```

### Langkah 8: Upload File (Gambar)

Untuk endpoint yang memerlukan upload file (Category, Product, Transaction):

1. Klik request (contoh: **"Create Category"**)
2. Pergi ke tab **Body**
3. Pilih **form-data**
4. Untuk field `image`:
   - Klik dropdown di sebelah kanan → pilih **File**
   - Klik **Select Files** → pilih gambar dari komputer
5. Isi field lainnya (name, description, dll)
6. Klik **Send**

### Tips & Troubleshooting

#### ❌ Error: "Access Denied: No token provided"

**Solusi**: Anda belum login. Lakukan login terlebih dahulu.

#### ❌ Error: "Invalid token. Please log in again."

**Solusi**:

1. Token mungkin sudah expired. Login ulang.
2. Pastikan format header: `Bearer <token>` (dengan spasi setelah Bearer)
3. Jangan ada spasi di awal/akhir token

#### ❌ Error: "Validation failed"

**Solusi**: Cek field yang required di request body. Lihat pesan error untuk detail field yang salah.

#### ❌ Error: 429 Too Many Requests

**Solusi**: Rate limit tercapai (100 request/15 menit). Tunggu beberapa saat.

#### 🔄 Cara Reset Token

Jika perlu login ulang:

1. Klik ikon gear ⚙️ di collection
2. Pilih tab **Variables**
3. Hapus value dari `TOKEN`
4. Lakukan login ulang

### Environment Variables di Collection

| Variable         | Deskripsi                          | Default Value           |
| ---------------- | ---------------------------------- | ----------------------- |
| `BASE_URL`       | URL server                         | `http://localhost:5001` |
| `TOKEN`          | JWT token (auto-saved after login) | -                       |
| `CATEGORY_ID`    | ID kategori (auto-saved)           | -                       |
| `PRODUCT_ID`     | ID produk (auto-saved)             | -                       |
| `BANK_ID`        | ID bank (auto-saved)               | -                       |
| `TRANSACTION_ID` | ID transaksi (auto-saved)          | -                       |

---

## 🛡️ Security Features

| Feature                          | Implementation                     |
| -------------------------------- | ---------------------------------- |
| **Helmet**                       | HTTP security headers              |
| **CORS**                         | Configurable cross-origin policy   |
| **Rate Limiting**                | 100 requests per 15 minutes per IP |
| **JWT Verification**             | Token-based authentication         |
| **Password Hashing**             | bcrypt with salt rounds            |
| **Input Validation**             | Comprehensive request validation   |
| **MongoDB Injection Prevention** | Mongoose sanitization              |

---

## 📝 Scripts

| Script       | Deskripsi                                 |
| ------------ | ----------------------------------------- |
| `pnpm dev`   | Menjalankan server dalam development mode |
| `pnpm build` | Compile TypeScript ke JavaScript          |
| `pnpm start` | Menjalankan server dari compiled code     |

---

<p align="center">
  Made by Kevin to complete the Aguna Course
</p>
