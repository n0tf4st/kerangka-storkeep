# temp

Tempat skrip & output **sekali pakai**: alat bantu sementara, hasil ekspor, data uji, potongan log.

Aturan:

- Nama jelas: `cek-<tujuan>.mjs`, `out-<tujuan>.json`, `dump-<tujuan>.txt`.
- **Hapus setelah selesai dipakai** — folder ini bukan gudang.
- Jangan simpan rahasia atau data user di sini.
- Seluruh isi folder ini tidak di-push (lihat `git-exclude-template.txt`).
- Kalau pekerjaan yang sama dilakukan dua kali, naikkan skripnya ke `tools/lokal/<tujuan>/`.
