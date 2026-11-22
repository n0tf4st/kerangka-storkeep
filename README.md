# Kerangka Proyek Storkeep

Folder ini **template bersih**, bukan proyek. Cara pakai:

## 1. Salin ke proyek baru

```sh
cp -r "D:/web/kerangka storkeep/." "D:/web/<proyek-baru>/"
cd "D:/web/<proyek-baru>"
```

## 2. Siapkan git

```sh
git init
cp git-exclude-template.txt .git/info/exclude
rm git-exclude-template.txt
```

## 3. Jalankan sesi pertama

Buka proyek di editor, lalu minta agent:

> "Baca AGENTS.md, lalu tanya saya model, jenis proyek, framework, ekstensi file, database, dan target deploy."

Agent akan:
1. `node tools/lokal/model/deteksi.mjs --json` — deteksi model (atau tanya bila gagal).
2. Menanyakan jenis proyek, framework, ekstensi, database, deploy **sekaligus**.
3. Mengisi `PROYEK.MD`, `TEKNIS.MD`, `OPERASI.MD` sebelum menulis kode.
4. Membuat `src/`, `tests/`, tool sesuai stack, lalu mencatat di `CHANGELOG.MD`.

## Isi kerangka

```
AGENTS.md                 aturan kerja (wajib dibaca agent)
.agents/
├── PROYEK.MD             apa & kenapa
├── TEKNIS.MD             struktur, command/route, DB
├── OPERASI.MD            lingkungan, env, deploy
├── KERJA.MD              kasus, rencana, sesi & model
├── CHANGELOG.MD          riwayat (panduan format di kepala file)
├── sampel/README.md      bahan reproduksi bug
├── arsip/                (dibuat saat perlu)
└── temp/                 skrip sekali pakai (hapus setelah dipakai)
tools/lokal/model/
├── deteksi.mjs           deteksi model + provider + aplikasi sesi
└── uji-deteksi.mjs       tes tool deteksi
.env.example
git-exclude-template.txt
```

## Prinsip yang sudah tertanam

- Model dicatat otomatis (tidak perlu tanya bila tool berhasil).
- Satu fakta satu tempat: tidak ada dokumen duplikat.
- Changelog: header versi sekali tulis, poin `A.`/`A.1.`, model + jam WIB per poin.
- Rahasia hanya di `env/` atau dashboard platform — tidak di `.agents/` dan tidak di kode.
- Tool dipakai ulang, bukan skrip sementara berulang.
