# TEKNIS — <NAMA PROYEK>

Bagaimana kode disusun. Perbarui setiap menambah/menghapus file atau command.

Stack: `<bahasa + versi>` · `<framework>` · `<database>` · `<deploy>`
Diperbarui: `<YYYY-MM-DD HH:MM WIB>` — Model: `<nama>`

---

## 1. Arah dependensi (jangan dibalik)

```
entry → app/router → handlers → services → repo → db
                         ↓
                  ui / lib        (tanpa DB, tanpa ctx global)
```

- Handler boleh memakai objek request/ctx; service tidak.
- Semua query SQL **hanya** di `repo/` (atau `db/`).
- `lib/` wajib murni (tanpa I/O) agar bisa diuji tanpa DB.

## 2. Struktur direktori

```
src/
├── <entry>            # titik masuk
├── <router/handlers>  # perintah / route
├── <services>         # aturan bisnis
├── <repo>             # SQL
├── <lib>              # util murni
└── <config>           # pembacaan env
tests/                 # unit test
tools/
├── produksi/          # di-push (build, job terjadwal)
└── lokal/             # tidak di-push (operator)
```

## 3. Daftar command / route

| Command / Route | Handler | Keterangan |
|---|---|---|
| `<...>` | `<path>` | `<...>` |

Aturan: satu command = satu handler; jangan ada dua handler untuk hal sama.

## 4. Skema database

| Tabel | Kunci | Isi |
|---|---|---|
| `<...>` | `<...>` | `<...>` |

Berkas skema: `<path>`. Urutan penerapan: `<...>`.

## 5. Status modul

| Modul | Berkas | Status |
|---|---|---|
| `<...>` | `<...>` | `<belum / dikerjakan / selesai>` |

## 6. Verifikasi wajib

```sh
<perintah build>
<perintah test>
<perintah audit kode>
```

Setiap refactor wajib lulus semuanya.
