# KreasiKu – Marketplace Jasa Desain Grafis (APN)

Website marketplace jasa desain grafis (logo, poster, banner, kemasan, konten media sosial).

## Cara menjalankan
1. Buka folder ini di VS Code (File > Open Folder).
2. Install ekstensi **Live Server** (Ritwick Dey).
3. Klik kanan `index.html` > **Open with Live Server**.
(Perlu internet karena jsPDF dan SheetJS dimuat dari CDN.)

## Struktur folder
```
APN/
├── index.html      # kerangka halaman
├── css/style.css   # tampilan (mendukung mode terang/gelap & print)
├── js/app.js       # seluruh logika aplikasi
└── README.md
```

## Akun demo
| Peran    | Email               | Password    |
|----------|---------------------|-------------|
| Admin    | admin@kreasiku.id   | admin123    |
| Klien    | budi@mail.com       | klien123    |
| Klien    | maya@mail.com       | klien123    |
| Desainer | sari@kreasiku.id    | desainer123 |
| Desainer | raka@kreasiku.id    | desainer123 |

## Fitur
- 3 aktor: Klien, Desainer, Admin (login + password, klien bisa daftar)
- Katalog layanan dengan foto (desainer bisa upload foto sendiri)
- Payment gateway simulator (QRIS, VA BCA/Mandiri, GoPay, Kartu Kredit; sukses/gagal)
- Invoice: cetak (print) dan unduh PDF
- Laporan keuangan: filter tanggal/status/kategori/desainer, cetak PDF, ekspor Excel

## Fitur tambahan (revisi)
- Klien mendaftar akun sendiri (nama, email, no. HP, password); akun Desainer dibuat Admin
- CRUD layanan/menu: tambah, edit, hapus (Desainer untuk layanannya, Admin untuk semua)
- Foto contoh per layanan: hingga 6 foto, galeri di halaman Detail
- Pencarian + filter kategori di katalog
- Admin: menu Kelola Layanan dan Pengguna

## Catatan
- Data disimpan di localStorage browser (tanpa backend). Reset: DevTools > Application > Local Storage > hapus key `kreasiku.v2`.
- Password di-hash SHA-256 di sisi browser; cukup untuk demo, belum untuk produksi.
