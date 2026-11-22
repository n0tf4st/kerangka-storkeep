# MODEL-LOG

Catatan sesi model per proyek. Format: `- HH:MM — [platform] keterangan — Model: <nama>`.

Disusun per bulan (terbaru di atas) → per tanggal (terbaru di atas).

Aturan: catat HANYA saat kejadian — sesi baru / ganti model / ganti tanggal. Sesi baru tetap dicatat walau modelnya sama. Jangan duplikat sesi yang sama.

Bisa dibuat otomatis: `node tools/lokal/model/deteksi.mjs --catat` (menambah entri "sesi baru" di tanggal hari ini).
Bila tool gagal menulis (exit ≠ 0), agent mencatat manual di file ini.

Bulan lalu: `arsip/dokumen-lama/MODEL-LOG-<tahun>-<bulan>.md`.

---

## `<YYYY>` — `<Bulan>`

### `<YYYY-MM-DD>`

- `<HH:MM>` — [`<Platform>`] sesi baru — Model: `<nama>`
