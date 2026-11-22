import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const akar = process.cwd();
const folderAgents = join(akar, '.agents');

const DOKUMEN_BOLEH = ['PROYEK.MD', 'TEKNIS.MD', 'OPERASI.MD', 'KERJA.MD', 'MODEL-LOG.MD', 'CHANGELOG.MD'];
const ENTRI_BOLEH = [...DOKUMEN_BOLEH, 'arsip', 'sampel', 'temp'];
const BATAS_CHANGELOG_BARIS = 250;
const BATAS_AGENTS_BYTE = 2 * 1024 * 1024;

const POLA_SAMPAH = [/^_?tmp/i, /\.tmp$/i, /\.bak$/i, /\.old$/i, /~$/];
const POLA_RAHASIA = [/^\.env/i, /\.token$/i, /\.netrc$/i, /\.key$/i, /\.pem$/i, /^kredensial/i];

const temuan = [];

function tambah(pesan) {
  temuan.push(pesan);
}

function ukuranFolder(jalur) {
  let total = 0;
  for (const isi of readdirSync(jalur, { withFileTypes: true })) {
    const satu = join(jalur, isi.name);
    total += isi.isDirectory() ? ukuranFolder(satu) : statSync(satu).size;
  }
  return total;
}

if (!existsSync(folderAgents)) {
  console.log('❌ folder .agents/ tidak ada');
  process.exit(2);
}

for (const isi of readdirSync(akar, { withFileTypes: true })) {
  if (!isi.isFile()) continue;
  if (POLA_SAMPAH.some((pola) => pola.test(isi.name))) {
    tambah(`sampah di root: ${isi.name} → pindah ke .agents/temp/ lalu hapus`);
  }
}

for (const isi of readdirSync(folderAgents, { withFileTypes: true })) {
  if (!ENTRI_BOLEH.includes(isi.name)) {
    tambah(`entri tak dikenal di .agents/: ${isi.name}${isi.isDirectory() ? '/' : ''} → pindah ke arsip/`);
  }
  if (POLA_RAHASIA.some((pola) => pola.test(isi.name))) {
    tambah(`berkas mirip rahasia di .agents/: ${isi.name} → pindah ke env/`);
  }
}

for (const nama of DOKUMEN_BOLEH) {
  if (!existsSync(join(folderAgents, nama))) {
    tambah(`dokumen inti hilang: .agents/${nama}`);
  }
}

const jalurChangelog = join(folderAgents, 'CHANGELOG.MD');

if (existsSync(jalurChangelog)) {
  const isi = readFileSync(jalurChangelog, 'utf8');
  const baris = isi.split('\n').length;
  if (baris > BATAS_CHANGELOG_BARIS) {
    tambah(`CHANGELOG.MD ${baris} baris (batas ${BATAS_CHANGELOG_BARIS}) → arsipkan entri lama`);
  }
  if (!isi.includes('— Model:')) {
    tambah('CHANGELOG.MD belum memakai header versi ber-model');
  }
}

const ukuran = ukuranFolder(folderAgents);

if (ukuran > BATAS_AGENTS_BYTE) {
  tambah(`ukuran .agents/ ${(ukuran / 1024 / 1024).toFixed(1)} MB (batas 2 MB) → bersihkan temp/arsip`);
}

if (temuan.length === 0) {
  console.log('✅ bersih — struktur .agents/ dan root sesuai kerangka');
  console.log(`   dokumen inti: ${DOKUMEN_BOLEH.length} · ukuran .agents: ${(ukuran / 1024).toFixed(0)} KB`);
  process.exit(0);
}

console.log(`⚠️  ${temuan.length} temuan:`);
for (const satu of temuan) console.log(`  - ${satu}`);
process.exit(1);
