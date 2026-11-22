import { spawnSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const JALUR_LOG = join('.agents', 'MODEL-LOG.MD');
const SELISIH_WIB_MENIT = 7 * 60;

const EKOR_AWAL_BYTE = 1_048_576;
const EKOR_MAKS_BYTE = 16_777_216;
const KEPALA_BYTE = 524_288;
const BATAS_SEGAR_MS = Number(process.env.AGENT_MODEL_SEGAR_JAM ?? 6) * 60 * 60_000;
const BATAS_INDUK = 6;

const NAMA_PLATFORM = {
  zed: 'Zed',
  vscode: 'VS Code',
  'vs code': 'VS Code',
  cursor: 'Cursor',
  windsurf: 'Windsurf',
  trae: 'Trae',
  opencode: 'opencode',
  commandcode: 'CommandCode',
  'command-code': 'CommandCode',
  'command code': 'CommandCode',
  copilot: 'GitHub Copilot',
  claudecode: 'Claude Code',
  'claude code': 'Claude Code',
  freebuff: 'Freebuff',
  codebuff: 'Freebuff',
};

const NAMA_PROVIDER = {
  commandcode: 'CommandCode',
  'command-code': 'CommandCode',
  'command code': 'CommandCode',
  opencode: 'opencode',
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  google: 'Google',
  github: 'GitHub',
  deepseek: 'DeepSeek',
  meta: 'Meta',
  mistral: 'Mistral',
  qwen: 'Qwen',
  alibaba: 'Alibaba',
  xai: 'xAI',
  databyte: 'Databyte',
  seekai: 'SeekAI',
  aitioo: 'Aitioo',
  openrouter: 'OpenRouter',
  '9router': '9Router',
  freebuff: 'Freebuff',
  codebuff: 'Freebuff',
};

const APLIKASI_SUMBER = {
  'copilot session-state': 'GitHub Copilot',
  'zed threads': 'Zed',
  'opencode session': 'opencode',
};

const POLA_NAMA_APLIKASI = [
  [/^zed(\.exe)?$/i, 'Zed'],
  [/^code( - insiders)?\.exe$/i, 'VS Code'],
  [/^trae(\.exe)?$/i, 'Trae'],
  [/^cursor\.exe$/i, 'Cursor'],
  [/^windsurf(\.exe)?$/i, 'Windsurf'],
  [/^opencode(\.exe)?$/i, 'opencode'],
  [/^claude(\.exe)?$/i, 'Claude Code'],
];

const catatan = [];
let aplikasiCache;

export function namaPlatform(kunci) {
  if (!kunci) return null;
  return NAMA_PLATFORM[String(kunci).toLowerCase()] ?? String(kunci);
}

export function namaProvider(kunci) {
  if (!kunci) return null;
  return NAMA_PROVIDER[String(kunci).toLowerCase()] ?? String(kunci);
}

export function pecahModel(mentah) {
  const bagian = String(mentah ?? '').split('/').filter(Boolean);
  if (bagian.length === 0) return { model: String(mentah ?? ''), provider: null };

  const model = bagian[bagian.length - 1];

  if (bagian.length === 1) return { model, provider: null };

  const kunci = bagian.slice(0, -1).find((satu) => NAMA_PROVIDER[satu.toLowerCase()]);

  return { model, provider: kunci ? namaProvider(kunci) : bagian[0] };
}

export function platformUntuk(sumber) {
  return APLIKASI_SUMBER[sumber] ?? null;
}

function rumah(...bagian) {
  return join(homedir(), ...bagian);
}

function bacaEkor(jalur, byte) {
  const fd = openSync(jalur, 'r');

  try {
    const ukuran = statSync(jalur).size;
    const mulai = Math.max(0, ukuran - byte);
    const buf = Buffer.alloc(Math.min(byte, ukuran));

    readSync(fd, buf, 0, buf.length, mulai);
    return buf.toString('utf8');
  } finally {
    closeSync(fd);
  }
}

function bacaKepala(jalur, byte) {
  const fd = openSync(jalur, 'r');

  try {
    const buf = Buffer.alloc(byte);
    const dibaca = readSync(fd, buf, 0, buf.length, 0);
    return buf.subarray(0, dibaca).toString('utf8');
  } finally {
    closeSync(fd);
  }
}

function barisJson(teks) {
  const hasil = [];

  for (const baris of teks.split('\n')) {
    const bersih = baris.trim();
    if (!bersih.startsWith('{')) continue;

    try {
      hasil.push(JSON.parse(bersih));
    } catch {
      continue;
    }
  }

  return hasil;
}

function kandidat({ model, provider, platform, mentah, sumber, waktu, riwayat, paksa }) {
  if (!model) return null;

  return {
    model,
    provider: provider ?? null,
    platform: platform ?? null,
    mentah: mentah ?? model,
    sumber,
    waktu: waktu ?? 0,
    riwayat: riwayat ?? [],
    paksa: Boolean(paksa),
  };
}

function masihSegar(waktu, sekarang) {
  return Number.isFinite(waktu) && sekarang - waktu <= BATAS_SEGAR_MS;
}

function dariEnv() {
  const mentah = process.env.AGENT_MODEL;
  if (!mentah) return null;

  const { model, provider } = pecahModel(mentah);

  return kandidat({
    model,
    provider: process.env.AGENT_PROVIDER ?? provider,
    platform: process.env.AGENT_PLATFORM ?? platformUntuk('env'),
    mentah,
    sumber: 'env AGENT_MODEL',
    waktu: Number.MAX_SAFE_INTEGER,
    paksa: true,
  });
}

function jalurLogCopilot() {
  const akar = process.env.COPILOT_HOME || rumah('.copilot');
  const id = process.env.COPILOT_AGENT_SESSION_ID;

  if (id) {
    const berkas = join(akar, 'session-state', id, 'events.jsonl');
    if (existsSync(berkas)) return berkas;
  }

  const folder = join(akar, 'session-state');
  if (!existsSync(folder)) return null;

  const terbaru = readdirSync(folder, { withFileTypes: true })
    .filter((isi) => isi.isDirectory())
    .map((isi) => join(folder, isi.name, 'events.jsonl'))
    .filter((berkas) => existsSync(berkas))
    .map((berkas) => ({ berkas, waktu: statSync(berkas).mtimeMs }))
    .sort((a, b) => b.waktu - a.waktu)[0];

  return terbaru?.berkas ?? null;
}

function modelCopilot(jalur, sekarang) {
  const segar = statSync(jalur).mtimeMs;

  if (!masihSegar(segar, sekarang)) {
    catatan.push(`copilot skipped: ${Math.round((sekarang - segar) / 3_600_000)}h old`);
    return null;
  }

  let byte = EKOR_AWAL_BYTE;
  let riwayat = [];

  while (byte <= EKOR_MAKS_BYTE) {
    riwayat = barisJson(bacaEkor(jalur, byte))
      .filter((satu) => satu?.type === 'model.response')
      .map((satu) => satu?.data?.modelCall?.model)
      .filter((model) => typeof model === 'string' && model);

    if (riwayat.length > 0) break;
    if (statSync(jalur).size <= byte) break;
    byte *= 4;
  }

  const mentah =
    riwayat[riwayat.length - 1] ??
    barisJson(bacaKepala(jalur, KEPALA_BYTE)).find((satu) => satu?.type === 'session.start')?.data
      ?.selectedModel;

  if (!mentah) return null;

  const { model, provider } = pecahModel(mentah);
  const sumber = 'copilot session-state';

  return kandidat({
    model,
    provider,
    platform: platformUntuk(sumber),
    mentah,
    sumber,
    waktu: segar,
    riwayat,
  });
}

let sqliteDiperiksa;

export function sqliteTersedia() {
  if (sqliteDiperiksa !== undefined) return sqliteDiperiksa;

  const hasil = spawnSync(process.execPath, ['--no-warnings', '-e', "require('node:sqlite')"], {
    encoding: 'utf8',
    timeout: 20_000,
  });

  sqliteDiperiksa = hasil.status === 0;
  return sqliteDiperiksa;
}

function bacaSqlite(jalur, kode) {
  if (!sqliteTersedia()) {
    catatan.push(`node:sqlite unavailable on Node ${process.versions.node} — source ${jalur.split(/[\\/]/).pop()} skipped`);
    return null;
  }

  const hasil = spawnSync(process.execPath, ['--no-warnings', '-e', kode, jalur], {
    encoding: 'utf8',
    timeout: 30_000,
  });

  if (hasil.status !== 0) return null;

  try {
    return JSON.parse(hasil.stdout.trim().split('\n').pop());
  } catch {
    return null;
  }
}

function modelRouter(jalur, sekarang) {
  if (!existsSync(jalur)) return null;

  const baris = bacaSqlite(
    jalur,
    [
      "const { DatabaseSync } = require('node:sqlite');",
      'const d = new DatabaseSync(process.argv[1], { readOnly: true });',
      "const r = d.prepare('SELECT provider, model, timestamp FROM usageHistory ORDER BY timestamp DESC LIMIT 5').all();",
      'console.log(JSON.stringify(r));',
    ].join('\n'),
  );

  if (!Array.isArray(baris) || baris.length === 0) return null;

  const terakhir = baris[0];
  const waktu = Date.parse(terakhir.timestamp);

  if (Number.isNaN(waktu)) return null;

  if (!masihSegar(waktu, sekarang)) {
    catatan.push(`usageHistory 9router skipped: ${Math.round((sekarang - waktu) / 3_600_000)}h old`);
    return null;
  }

  const { model, provider } = pecahModel(terakhir.model);
  const sumber = '9router usageHistory';

  const riwayat = [];
  for (const satu of baris) {
    if (riwayat[riwayat.length - 1] === satu.model) continue;
    riwayat.push(satu.model);
  }

  return kandidat({
    model,
    provider: namaProvider(terakhir.provider) ?? provider,
    platform: platformUntuk(sumber),
    mentah: `${terakhir.provider}/${terakhir.model}`,
    sumber,
    waktu,
    riwayat,
  });
}

function modelZed(jalur, sekarang) {
  if (!existsSync(jalur)) return null;

  const data = bacaSqlite(
    jalur,
    [
      "const { DatabaseSync } = require('node:sqlite');",
      "const { zstdDecompressSync } = require('node:zlib');",
      'const d = new DatabaseSync(process.argv[1], { readOnly: true });',
      "const r = d.prepare('SELECT data, updated_at FROM threads ORDER BY updated_at DESC LIMIT 1').get();",
      "if (!r) { console.log('null'); process.exit(0); }",
      'const j = JSON.parse(zstdDecompressSync(r.data).toString());',
      'console.log(JSON.stringify({ model: j.model, diperbarui: r.updated_at }));',
    ].join('\n'),
  );

  if (!data?.model?.model) return null;

  const waktu = Date.parse(data.diperbarui ?? '');

  if (!Number.isNaN(waktu) && !masihSegar(waktu, sekarang)) {
    catatan.push(`Zed thread skipped: ${Math.round((sekarang - waktu) / 3_600_000)}h old`);
    return null;
  }

  const { model } = pecahModel(data.model.model);
  const sumber = 'zed threads';

  return kandidat({
    model,
    provider: namaProvider(data.model.provider) ?? pecahModel(data.model.model).provider,
    platform: platformUntuk(sumber),
    mentah: `${data.model.provider ?? 'zed'}/${data.model.model}`,
    sumber,
    waktu: Number.isNaN(waktu) ? 0 : waktu,
  });
}

function modelOpencode(jalur, sekarang) {
  if (!existsSync(jalur)) return null;

  const baris = bacaSqlite(
    jalur,
    [
      "const { DatabaseSync } = require('node:sqlite');",
      'const d = new DatabaseSync(process.argv[1], { readOnly: true });',
      "console.log(JSON.stringify(d.prepare('SELECT model, time_updated FROM session ORDER BY time_updated DESC LIMIT 3').all()));",
    ].join('\n'),
  );

  if (!Array.isArray(baris)) return null;

  for (const satu of baris) {
    let isi = null;

    try {
      isi = JSON.parse(satu.model ?? '{}');
    } catch {
      continue;
    }

    const waktu = Number(satu.time_updated) || 0;

    if (!isi.id || !masihSegar(waktu, sekarang)) continue;

    const sumber = 'opencode session';

    return kandidat({
      model: isi.id,
      provider: namaProvider(isi.providerID) ?? null,
      platform: platformUntuk(sumber),
      mentah: `${isi.providerID ?? 'opencode'}/${isi.id}`,
      sumber,
      waktu,
    });
  }

  return null;
}

function aplikasiDariCmd(cmd) {
  if (!cmd) return null;
  if (/command-?code/i.test(cmd)) return 'CommandCode';
  if (/opencode/i.test(cmd)) return 'opencode';
  if (/\bclaude\b/i.test(cmd)) return 'Claude Code';
  if (/\bzed\b/i.test(cmd)) return 'Zed';
  return null;
}

function prosesWindows() {
  const skrip =
    'Get-CimInstance Win32_Process | Where-Object { $_.Name -match ' +
    "'zed|code|trae|cursor|windsurf|opencode|node|claude'" +
    ' } | Select-Object ProcessId,ParentProcessId,Name,CommandLine | ConvertTo-Json -Compress';

  const hasil = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', skrip], {
    encoding: 'utf8',
    timeout: 20_000,
    windowsHide: true,
  });

  if (hasil.status !== 0 || !hasil.stdout) return new Map();

  let data;

  try {
    data = JSON.parse(hasil.stdout.trim());
  } catch {
    return new Map();
  }

  const peta = new Map();
  for (const satu of Array.isArray(data) ? data : [data]) peta.set(Number(satu.ProcessId), satu);
  return peta;
}

export function aplikasiDariEnv(env = process.env) {
  const term = String(env.TERM_PROGRAM ?? '').toLowerCase();

  if (term.includes('vscode')) return 'VS Code';
  if (term.includes('zed')) return 'Zed';
  if (term.includes('trae')) return 'Trae';
  if (term.includes('cursor')) return 'Cursor';
  if (term.includes('windsurf')) return 'Windsurf';
  if (term.includes('opencode')) return 'opencode';

  if (env.ZED_TERM || env.ZED_ENVIRONMENT) return 'Zed';
  if (env.VSCODE_PID || env.VSCODE_IPC_HOOK) return 'VS Code';
  if (env.CURSOR_TRACE_ID) return 'Cursor';
  if (env.CLAUDECODE) return 'Claude Code';

  return null;
}

function aplikasiDariProses() {
  if (process.platform !== 'win32') return null;

  const peta = prosesWindows();
  if (peta.size === 0) return null;

  let id = process.ppid;

  for (let langkah = 0; langkah < BATAS_INDUK && id; langkah += 1) {
    const satu = peta.get(Number(id));
    if (!satu) break;

    const nama = String(satu.Name ?? '');
    const cocok = POLA_NAMA_APLIKASI.find(([pola]) => pola.test(nama));

    if (cocok) return cocok[1];

    if (/^node(\.exe)?$/i.test(nama)) {
      const dariCmd = aplikasiDariCmd(satu.CommandLine);
      if (dariCmd) return dariCmd;
    }

    id = satu.ParentProcessId;
  }

  return null;
}

export function deteksiAplikasi() {
  if (aplikasiCache !== undefined) return aplikasiCache;

  aplikasiCache = aplikasiDariEnv() ?? aplikasiDariProses();
  return aplikasiCache;
}

function kumpulkan() {
  const sekarang = Date.now();
  const daftar = [dariEnv()];

  const copilot = jalurLogCopilot();
  if (copilot) daftar.push(modelCopilot(copilot, sekarang));

  daftar.push(modelRouter(rumah('AppData', 'Roaming', '9router', 'db', 'data.sqlite'), sekarang));
  daftar.push(modelZed(rumah('AppData', 'Local', 'Zed', 'threads', 'threads.db'), sekarang));
  daftar.push(modelOpencode(rumah('.local', 'share', 'opencode', 'opencode.db'), sekarang));

  return daftar.filter(Boolean);
}

function prioritas(kandidatSatu, aplikasi) {
  if (kandidatSatu.paksa) return 2;
  if (aplikasi && kandidatSatu.platform === aplikasi) return 1;
  return 0;
}

function urutkan(daftar, aplikasi) {
  return daftar.sort((a, b) => prioritas(b, aplikasi) - prioritas(a, aplikasi) || b.waktu - a.waktu);
}

function platformAkhir(kandidatSatu, aplikasi) {
  return kandidatSatu.platform ?? aplikasi ?? '-';
}

export function waktuWib() {
  const geser = new Date(Date.now() + SELISIH_WIB_MENIT * 60_000);
  const dua = (nilai) => String(nilai).padStart(2, '0');

  return {
    tanggal: `${geser.getUTCFullYear()}-${dua(geser.getUTCMonth() + 1)}-${dua(geser.getUTCDate())}`,
    jam: `${dua(geser.getUTCHours())}:${dua(geser.getUTCMinutes())}`,
  };
}

function sisipkan(isi, tanggal, barisBaru) {
  const garis = isi.split('\n');
  const judul = `### ${tanggal}`;
  const posisi = garis.findIndex((satu) => satu.trim() === judul);

  if (posisi >= 0) {
    let titik = posisi + 1;
    while (titik < garis.length && garis[titik].trim() === '') titik += 1;
    garis.splice(titik, 0, barisBaru);
    return garis.join('\n');
  }

  const pertama = garis.findIndex((satu) => satu.startsWith('### '));
  const blok = [judul, '', barisBaru, ''];

  if (pertama >= 0) garis.splice(pertama, 0, ...blok);
  else garis.push('', ...blok);

  return garis.join('\n');
}

export function catatSesi({ model, platform, catatan = 'new session (auto-detected)' }) {
  const { tanggal, jam } = waktuWib();
  const barisBaru = `- ${jam} — [${platform ?? '-'}] ${catatan} — Model: ${model}`;

  try {
    let isi = '';

    if (existsSync(JALUR_LOG)) {
      isi = readFileSync(JALUR_LOG, 'utf8');

      const sudahAda = isi
        .split('\n')
        .some((satu) => satu.trim().startsWith(`- ${jam} —`) && satu.includes(`Model: ${model}`));

      if (sudahAda) {
        return { berhasil: true, dilewati: true, pesan: `skipped    : entry ${jam} WIB already exists` };
      }
    } else {
      mkdirSync('.agents', { recursive: true });
      isi = [
        '# MODEL-LOG',
        '',
        'Session & model log. Format: `- HH:MM — [platform] note — Model: <name>`.',
        '',
        '---',
      ].join('\n');
    }

    writeFileSync(JALUR_LOG, sisipkan(isi, tanggal, barisBaru), 'utf8');
    return { berhasil: true, dilewati: false, pesan: `recorded   : ${JALUR_LOG} — ${tanggal} ${jam} WIB` };
  } catch (err) {
    return { berhasil: false, dilewati: false, pesan: `write failed: ${err.message}` };
  }
}

function tampil(info, aplikasi, semua) {
  console.log(`model    : ${info.model}`);
  console.log(`provider : ${info.provider ?? '-'}`);
  console.log(`platform : ${platformAkhir(info, aplikasi)}`);
  console.log(`source   : ${info.sumber}`);

  if (aplikasi) console.log(`host app : ${aplikasi}`);

  const unik = [];

  for (const satu of info.riwayat) {
    if (unik[unik.length - 1] === satu) continue;
    unik.push(satu);
  }

  if (unik.length > 1) {
    console.log('history  :');
    for (const satu of unik) console.log(`  - ${pecahModel(satu).model}`);
  }

  if (catatan.length > 0) {
    console.log('notes    :');
    for (const satu of catatan) console.log(`  - ${satu}`);
  }

  if (semua) {
    console.log('candidates:');
    for (const satu of semua) {
      console.log(`  - ${satu.model} (${satu.provider ?? '-'} · ${satu.platform ?? '-'} · ${satu.sumber})`);
    }
  }
}

export function jalankan(argv = process.argv) {
  const aplikasi = deteksiAplikasi();
  const daftar = urutkan(kumpulkan(), aplikasi);

  if (daftar.length === 0) {
    console.error('❌ model not detected — set env AGENT_MODEL=<model name>');
    for (const satu of catatan) console.error(`   note: ${satu}`);
    return 2;
  }

  const [teratas] = daftar;

  if (argv.includes('--json')) {
    console.log(
      JSON.stringify({
        model: teratas.model,
        provider: teratas.provider,
        platform: platformAkhir(teratas, aplikasi),
        aplikasi,
        sumber: teratas.sumber,
        waktu: teratas.waktu,
        catatan,
        kandidat: daftar.map((satu) => ({
          model: satu.model,
          provider: satu.provider,
          platform: satu.platform,
          sumber: satu.sumber,
          waktu: satu.waktu,
        })),
      }),
    );
  } else {
    tampil(teratas, aplikasi, argv.includes('--semua') ? daftar : null);
  }

  if (argv.includes('--catat')) {
    const hasil = catatSesi({ model: teratas.model, platform: platformAkhir(teratas, aplikasi) });
    console.log(hasil.pesan);
    if (!hasil.berhasil) return 1;
  }

  return 0;
}

const dijalankanLangsung =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

if (dijalankanLangsung) process.exit(jalankan());
