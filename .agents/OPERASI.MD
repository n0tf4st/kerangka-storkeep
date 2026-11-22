# OPERASI — <NAMA PROYEK>

Di mana aplikasi berjalan, cara deploy, dan apa yang tidak boleh disentuh.
**Tidak ada kredensial di dokumen ini.**

Diperbarui: `<YYYY-MM-DD HH:MM WIB>` — Model: `<nama>`

---

## 1. Lingkungan

| | Produksi | Staging |
|---|---|---|
| Runtime | `<VPS / Heroku / lainnya>` | `<...>` |
| Domain/bot | `<...>` | `<...>` |
| Env | `<path env di server>` | `<Config Vars / file>` |
| Database | `<...>` | `<...>` |
| Deploy | `<perintah / manual>` | `<perintah>` |

**Aturan:** produksi tidak diubah tanpa perintah eksplisit user.

## 2. Env lokal (tidak di-push)

```
env/
├── mesin.env          # kunci tool lokal (semua lingkungan)
├── production/.env    # cermin nilai produksi untuk tool
├── staging/.env       # staging
└── vendor/            # kredensial vendor: <nama vendor>/
```

Seluruh `env/` di-ignore lewat `.git/info/exclude` (lihat `git-exclude-template.txt`).

## 3. Variabel yang dipakai kode

| Nama | Wajib | Keterangan |
|---|---|---|
| `<NAMA>` | ya/tidak | `<...>` |

## 4. Deploy

```sh
<langkah 1>
<langkah 2>
<verifikasi log / health check>
```

## 5. Keamanan

| Aspek | Kondisi |
|---|---|
| Akses DB | `<DML-only? port lokal?>` |
| Rotasi kredensial | `<interval / prosedur>` |
| Retensi data | `<...>` |

## 6. Tool operator

| Tool | Fungsi |
|---|---|
| `tools/lokal/model/deteksi.mjs` | deteksi model + provider + aplikasi sesi |
| `<...>` | `<...>` |

## 7. Kesalahan umum

| Gejala | Sebab | Perbaikan |
|---|---|---|
| `<...>` | `<...>` | `<...>` |
