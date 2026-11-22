# KERJA — <NAMA PROYEK>

Semua yang sedang dikerjakan. Temuan dicatat dulu (tanpa izin), dikerjakan setelah disetujui.
Kasus selesai dipindah ke `arsip/kasus-selesai/YYYY-MM-DD-kategori-judul.md`.

**Format kasus:** `- YYYY-MM-DD HH:MM — [level] judul — status — Model: <nama>` + baris `Lokasi:`.
Level: `kritis` (rahasia/akses/data bocor) · `urgent` (fitur utama rusak) · `casual` (rapi-rapi).
Status: 🔴 Baru · 🟡 Dikerjakan · ⏸️ Tunda · ✅ Selesai.

---

## 1. Kasus aktif

_belum ada_

## 2. Rencana fitur

_belum ada_

## 3. Sesi & model

Dipindah ke berkas sendiri: **`.agents/MODEL-LOG.MD`** (bulan berjalan; bulan lalu di `arsip/dokumen-lama/`).
Catat lewat `node tools/lokal/model/deteksi.mjs --catat`, atau manual bila tool gagal.

## 4. Kerja multi-agent

Dipakai hanya bila user menulis `kerjakan bersama` / `multi agent` / `bagi tugas`.

- `- YYYY-MM-DD HH:MM (KORDINATOR|SUB-AGENT) — [level] judul — status — Model: <nama>` + checklist.
- Hanya koordinator menulis bagian ini; sub-agent melapor lewat `PLAN-PROGRESS/`.
- Arsip selesai: `arsip/plan-selesai/YYYY-MM-DD-judul.md`.

Status: _belum ada_
