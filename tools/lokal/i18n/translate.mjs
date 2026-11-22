import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DICT_DIR = join('tools', 'lokal', 'i18n', 'dict');

function argValue(name, fallback) {
  const found = process.argv.find((item) => item.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
}

function listDictionaries() {
  if (!existsSync(DICT_DIR)) return [];
  return readdirSync(DICT_DIR)
    .filter((name) => name.endsWith('.json') && !name.startsWith('_'))
    .map((name) => name.replace(/\.json$/, ''))
    .sort();
}

const available = listDictionaries();

if (process.argv.includes('--list')) {
  console.log(available.length ? available.join('\n') : 'no dictionaries found');
  process.exit(available.length ? 0 : 2);
}

const scaffold = argValue('scaffold', null);

if (scaffold) {
  const basePath = join(DICT_DIR, 'en.json');
  const targetPath = join(DICT_DIR, `${scaffold}.json`);

  if (existsSync(targetPath)) {
    console.log(`dictionary already exists: ${targetPath}`);
    process.exit(2);
  }

  if (!existsSync(basePath)) {
    console.log(`base dictionary missing: ${basePath}`);
    process.exit(2);
  }

  const base = JSON.parse(readFileSync(basePath, 'utf8'));

  const dibuat = {
    name: `${scaffold} (fill in)`,
    note: base.note,
    source: base.source.map(([from]) => [from, from]),
    tests: base.tests.map(([from]) => [from, from]),
  };

  writeFileSync(targetPath, `${JSON.stringify(dibuat, null, 2)}\n`, 'utf8');
  console.log(`created ${targetPath}`);
  console.log(`next: replace every right-hand string, then run --to=${scaffold} --in=<file> --out=<file>`);
  process.exit(0);
}

const target = argValue('to', 'en');
const dictPath = join(DICT_DIR, `${target}.json`);

if (!existsSync(dictPath)) {
  console.log(`dictionary not found: ${dictPath}`);
  console.log(`available: ${available.join(', ') || '(none)'}`);
  console.log('to add a language: copy dict/en.json to dict/<code>.json and translate the right-hand strings');
  process.exit(2);
}

const dictionary = JSON.parse(readFileSync(dictPath, 'utf8'));
const pairs = process.argv.includes('--tests')
  ? dictionary.tests ?? []
  : dictionary.source ?? [];

const input = argValue('in', 'tools/lokal/model/detect.mjs');
const output = argValue('out', `.agents/temp/translated-${target}.txt`);

if (!existsSync(input)) {
  console.log(`input not found: ${input}`);
  process.exit(2);
}

let text = readFileSync(input, 'utf8');
const missed = [];
let applied = 0;

for (const pair of pairs) {
  const [from, to] = pair;

  if (!text.includes(from)) {
    missed.push(from);
    continue;
  }

  text = text.split(from).join(to);
  applied += 1;
}

writeFileSync(output, text, 'utf8');

console.log(`language: ${dictionary.name ?? target} (${target})`);
console.log(`input   : ${input}`);
console.log(`output  : ${output}`);
console.log(`pairs   : ${applied}/${pairs.length} applied`);

if (process.argv.includes('--missing') && missed.length > 0) {
  console.log('not found in input (leftovers to translate when building a new dictionary):');
  for (const item of missed) console.log(`  - ${item}`);
}

const alreadyTarget = pairs.length > 0 && applied === 0 && missed.length === pairs.length;

if (alreadyTarget) console.log(`input already appears to be ${dictionary.name ?? target}`);

process.exit(applied > 0 || alreadyTarget ? 0 : 1);
