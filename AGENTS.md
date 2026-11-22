# Aturan Kerja — <NAMA PROYEK>

Template kerangka Storkeep. Ganti semua `<...>` sebelum dipakai.

## 0. Awal sesi (WAJIB, sebelum kerja apa pun)

1. **Deteksi model otomatis — TANYA hanya bila gagal**: jalankan `node tools/lokal/model/deteksi.mjs --catat` (tambahkan `--json` bila perlu keluaran mentah).
   Tool membaca jejak sesi editor di mesin ini, mencetak `model`, `provider`, `platform`, `sumber`, dan **langsung menulis** entri ke `.agents/MODEL-LOG.MD`.
   - exit `0` → **pakai hasilnya, JANGAN tanya user**
   - exit `2` (tidak terdeteksi) → baru tanya: _"Model apa yang saya pakai untuk sesi ini?"_
   - exit `1` (gagal mencatat) → catat manual di `.agents/MODEL-LOG.MD`
   - Sumber yang dibaca: `copilot session-state` (`events.jsonl`), `9router usageHistory`, `Zed threads`
     (`threads.db`), `opencode session` (`opencode.db`), env `AGENT_MODEL` (prioritas tertinggi).
   - **JANGAN** menyalin nama model dari entri lama di `.agents/KERJA.MD` atau `CHANGELOG.MD`
     (bisa jadi model sesi sebelumnya).
   - Setelah diketahui (dari tool maupun jawaban user), **langsung catat** di `.agents/MODEL-LOG.MD`
     — otomatis lewat `--catat`; manual hanya bila tool gagal.
     Bila `.agents/` belum ada, jalankan **langkah 2 (bootstrap)** dulu baru mencatat.
   - **Ganti model di tengah sesi**: jika user menyebut "ganti model" / "model berubah" /
     "sekarang pakai model X", jalankan ulang tool deteksi; bila hasilnya berubah, catat entri baru.
     Tanya user HANYA bila tool gagal mendeteksi.
2. **Bootstrap struktur bila `.agents/` belum ada**: proyek baru kadang hanya berisi `AGENTS.md` saja.
   Salin kerangka baku **tanpa menimpa** file yang sudah ada:

   ```sh
   cp -rn "<folder-kerangka>/.agents/." .agents/
   cp -rn "<folder-kerangka>/tools/." tools/
   ```

   `<folder-kerangka>` = lokasi clone kerangka di mesin ini. Kalau belum diketahui, tanya user **satu kali**
   (jangan menebak path). Di mesin ini contohnya `~/web/kerangka-storkeep`.

   Pemicu: `.agents/KERJA.MD` tidak ada, atau salah satu dari `PROYEK.MD` / `TEKNIS.MD` /
   `OPERASI.MD` / `CHANGELOG.MD` tidak ada. Tool `tools/lokal/model/deteksi.mjs` ikut tersalin,
   jadi deteksi model bisa langsung jalan. Untuk repo baru, salin juga
   `git-exclude-template.txt` → `.git/info/exclude`.
3. **Jika proyek masih kosong** (belum ada kode), tanya **sekaligus** sebelum menulis file:
   - Jenis proyek: bot Telegram / web API / web UI / CLI / worker / library / scraper
   - Framework/runtime: grammY · Express · Hono · Next.js · FastAPI · tanpa framework
   - Bahasa + ekstensi: `.mjs` · `.js` · `.ts` · `.py` · `.php`
   - Database: MySQL/MariaDB · Postgres · SQLite · tanpa DB
   - Deploy: VPS systemd · Heroku · Cloudflare · lokal saja
   Lalu isi `.agents/PROYEK.MD` + `.agents/TEKNIS.MD` + `.agents/OPERASI.MD`, baru tulis kode.
4. **Baca dokumen** (path relatif root): `PROYEK.MD`, `TEKNIS.MD`, `OPERASI.MD`, `KERJA.MD`,
   `MODEL-LOG.MD`, dan `CHANGELOG.MD` **60 baris teratas** saja.

## 1. Bahasa

Indonesia untuk komunikasi, komentar dokumen, dan teks yang dilihat user. Penamaan variabel/fungsi Indonesia.

## 2. Dokumen di `.agents/`

| Berkas | Isi |
|---|---|
| `PROYEK.MD` | apa & kenapa: tujuan, peran, batasan, privasi |
| `TEKNIS.MD` | struktur direktori, command/route, skema DB, status modul |
| `OPERASI.MD` | lingkungan, env, deploy, keamanan, tool, troubleshooting |
| `KERJA.MD` | kasus aktif, rencana, kerja multi-agent |
| `MODEL-LOG.MD` | sesi & model per tanggal (otomatis lewat `deteksi.mjs --catat`) |
| `CHANGELOG.MD` | riwayat perubahan (format ada di kepala file) |
| `arsip/` | dokumen lama, kasus selesai, changelog lama |
| `sampel/` | log chat / contoh input untuk reproduksi bug |

Aturan: satu fakta ditulis **satu tempat**. Jangan duplikasi info antar dokumen — cukup rujuk.

## 3. CHANGELOG

- Header: `## YYYY-MM-DD — vX.Y.Z — Model: <pengedit pertama> — HH:MM WIB` (ditulis sekali, tidak diedit lagi).
- Poin: `- **A.** …`, anak poin `  - **A.1.** …`, tiap poin diakhiri `— Model: <nama> — HH:MM WIB`.
- Kategori baku: ✨ Fitur Baru · 🔧 Perbaikan · 🔒 Keamanan · ⚙️ Deploy & Infra · 🎨 Desain · 📝 Dokumentasi.
- Saat tanggal berganti: tulis sekali jalan (header + poin + keenam kategori; yang kosong `_belum ada_`).
- Riwayat > 2 bulan → `arsip/CHANGELOG-<tahun>-<bulan>-lama.MD`.

## 4. Kasus (`KERJA.MD`)

- Format: `- YYYY-MM-DD HH:MM — [level] judul — status — Model: <nama>` + `Lokasi: path:baris`.
- Level: `kritis` (rahasia/data bocor) · `urgent` (fitur utama rusak) · `casual` (rapi-rapi).
- Alur: catat 🔴 → minta persetujuan → 🟡 kerjakan → ✅ arsip ke `.agents/arsip/kasus-selesai/`.
- Mencatat tidak perlu izin; mengerjakan perlu.

## 5. Rahasia

- Hanya di `env/` (di-ignore) atau dashboard platform (Config Vars / panel).
- Dilarang di `.agents/`, dokumen `.MD`, kode, atau log. Saat debug cetak nama variabel saja.
- Salin `git-exclude-template.txt` ke `.git/info/exclude` pada proyek baru.

## 6. Kode

- **Tanpa komentar** di file kode; alasan desain masuk `.agents/TEKNIS.MD`.
- Tanpa `console.log` debug yang tertinggal — pakai logger berlevel.
- Tanpa `TODO`/`FIXME` di kode — catat di `KERJA.MD`.
- Validasi input, escaping output, batas ukuran payload, timeout untuk panggilan jaringan.
- Handler wajib aman bila event terkirim ulang (idempoten).

## 7. Tool

- Cek `tools/` sebelum menulis skrip sementara.
- `tools/produksi/` = ikut di-push (dipakai build/job). `tools/lokal/` = tidak di-push.
- Skrip sekali pakai: `.agents/temp/`, hapus setelah dipakai.

## 8. Git

- Commit bahasa Indonesia, prefix `feat: ` / `fix: ` / `refactor: ` / `docs: ` / `chore: ` / `deploy: `.
- Satu commit = satu maksud. Dilarang `push --force` ke `main`.
- Commit/push setelah build & test lolos; deploy/aksi produksi wajib konfirmasi user.

## 9. Penutupan sesi

Sebutkan: kredensial yang sebaiknya dirotasi (bila sesi banyak menyentuh env/deploy), dan status lingkungan
(staging menyala/dimatikan) — tanpa mematikan apa pun tanpa perintah eksplisit user.

## 10. Kebersihan struktur (penjaga)

- `.agents/` hanya boleh berisi 5 dokumen inti + `arsip/`, `sampel/`, `temp/`. Dokumen lain → `arsip/dokumen-lama/`.
- Kredensial tidak pernah di `.agents/` — pakai `env/` atau dashboard platform.
- Tidak ada file sementara di root proyek (`_tmp_*`, `*.bak`, `*.old`, `*~`). Semua ke `.agents/temp/`, lalu hapus.
- Jalankan pemeriksa kapan pun struktur terasa melenceng:

  ```sh
  node tools/lokal/kebersihan/cek.mjs
  ```

  Exit `0` bersih · `1` ada temuan (disebutkan per baris) · `2` tidak bisa jalan.
- Proyek lama yang belum rapi: ikuti `MIGRASI.md` (pindah, bukan hapus).
