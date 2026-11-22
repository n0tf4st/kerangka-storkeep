# MIGRASI — merapikan proyek lama

Untuk proyek yang `.agents/`-nya sudah bercampur (banyak dokumen + folder vendor + temp).
Sekali jalan, aman: **tidak ada yang dihapus**, hanya dipindah.

## 1. Cek kondisi

```sh
node tools/lokal/kebersihan/cek.mjs
```

## 2. Buat folder tujuan

```sh
mkdir -p .agents/arsip/dokumen-lama .agents/arsip/kasus-selesai .agents/arsip/plan-selesai
```

## 3. Pindahkan dokumen lama

Dokumen yang tetap dipakai hanya lima: `PROYEK.MD`, `TEKNIS.MD`, `OPERASI.MD`, `KERJA.MD`, `CHANGELOG.MD`.

Gabungkan dulu isi dokumen lama ke lima dokumen itu (lihat pemetaan di README kerangka), lalu:

```sh
mv API-HOSTING.MD KONSEP.MD KEBIJAKAN.MD MODUL.MD PETA-LINGKUNGAN.MD \
   PANDUAN-KONFIGURASI.MD KEAMANAN-DB.MD README.MD STRUKTUR.MD \
   CASES.MD MODEL-LOG.MD PLAN.MD .agents/arsip/dokumen-lama/
```

## 4. Pindahkan kasus & plan selesai

```sh
mv .agents/CASES-DONE/* .agents/arsip/kasus-selesai/ 2>/dev/null
mv .agents/PLAN-DONE/* .agents/arsip/plan-selesai/ 2>/dev/null
rmdir .agents/CASES-DONE .agents/PLAN-DONE 2>/dev/null
```

## 5. Kredensial keluar dari `.agents/`

```sh
mkdir -p env/vendor
mv .agents/hostdata .agents/cloudflare .agents/layerbase env/vendor/ 2>/dev/null
```

Pastikan `env/` masuk `git/info/exclude`.

## 6. Bersihkan temp & sampah root

```sh
rm -rf .agents/temp
```

File `_tmp_*.ps1`, `_tmp_*.php`, `*.bak`, `*~` di root: pindah ke `.agents/temp/`, pakai, lalu hapus.

## 7. Arsipkan changelog lama

Pindahkan entri lebih dari 2 bulan ke `.agents/arsip/CHANGELOG-<tahun>-<bulan>-lama.MD`,
sisakan 1 baris indeks per versi di `CHANGELOG.MD`.

## 8. Verifikasi

```sh
node tools/lokal/kebersihan/cek.mjs
```

Target: exit `0`, `.agents/` hanya berisi 5 dokumen + `arsip/`, `sampel/`, `temp/`.
