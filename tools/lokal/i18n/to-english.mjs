import { readFileSync, writeFileSync } from 'node:fs';

const PAIRS_SOURCE = [
  ['sumber   :', 'source   :'],
  ['aplikasi :', 'host app :'],
  ["'catatan  :'", "'notes    :'"],
  ["'riwayat  :'", "'history  :'"],
  ["'kandidat :'", "'candidates:'"],
  ['catatan: ${satu}', 'note: ${satu}'],
  ['model tidak terdeteksi — set env AGENT_MODEL=<nama model>', 'model not detected — set env AGENT_MODEL=<model name>'],
  ['copilot dilewati: jejak ', 'copilot skipped: '],
  ['usageHistory 9router dilewati: ', 'usageHistory 9router skipped: '],
  ['thread Zed dilewati: ', 'Zed thread skipped: '],
  ['node:sqlite tidak tersedia di Node ', 'node:sqlite unavailable on Node '],
  [' — sumber ', ' — source '],
  [' dilewati`', ' skipped`'],
  [' jam`);', 'h old`);'],
  ['sesi baru (deteksi otomatis)', 'new session (auto-detected)'],
  ['dilewati   : entri ', 'skipped    : entry '],
  [' WIB sudah ada', ' WIB already exists'],
  ['tercatat   : ', 'recorded   : '],
  ['gagal catat: ', 'write failed: '],
  ['Catatan sesi model per proyek. Format: ', 'Session & model log. Format: '],
  ['keterangan — Model: <nama>', 'note — Model: <name>'],
];

const PAIRS_TESTS = [
  ['model dengan namespace provider dikenali', 'model with a provider namespace is recognised'],
  ['namespace aplikasi menang atas vendor', 'app namespace wins over the vendor'],
  ['namespace tak dikenal dilewati, vendor tetap dikenali', 'unknown namespace is skipped, vendor still recognised'],
  ['model tanpa namespace tidak punya provider', 'model without a namespace has no provider'],
  ['platform hanya dari aplikasi sumber, bukan provider', 'platform comes only from the source app, not the provider'],
  ['aplikasi dibaca dari env terminal', 'host app is read from terminal env'],
  ['pemetaan nama platform dan provider', 'platform and provider name mapping'],
];

function argValue(name, fallback) {
  const found = process.argv.find((item) => item.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
}

function apply(inputPath, outputPath, pairs) {
  let text = readFileSync(inputPath, 'utf8');
  const missed = [];

  for (const [from, to] of pairs) {
    if (!text.includes(from)) {
      missed.push(from);
      continue;
    }
    text = text.split(from).join(to);
  }

  writeFileSync(outputPath, text, 'utf8');
  return missed;
}

const input = argValue('in', 'tools/lokal/model/detect.mjs');
const output = argValue('out', '.agents/temp/to-english-detect.mjs');
const modeTests = process.argv.includes('--tests');
const pairs = modeTests ? PAIRS_TESTS : PAIRS_SOURCE;

const missed = apply(input, output, pairs);

console.log(`input : ${input}`);
console.log(`output: ${output}`);
console.log(`pairs : ${pairs.length - missed.length}/${pairs.length} applied`);
if (missed.length > 0) {
  console.log('not found:');
  for (const item of missed) console.log(`  - ${item}`);
}
