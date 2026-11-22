import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const agentsDir = join(root, '.agents');

const CORE_DOCS = ['PROJECT.MD', 'TECHNICAL.MD', 'OPERATIONS.MD', 'WORK.MD', 'MODEL-LOG.MD', 'CHANGELOG.MD'];
const ALLOWED = [...CORE_DOCS, 'STACK.MD', 'archive', 'samples', 'temp'];
const CHANGELOG_MAX_LINES = 250;
const AGENTS_MAX_BYTES = 2 * 1024 * 1024;

const JUNK_PATTERNS = [/^_?tmp/i, /\.tmp$/i, /\.bak$/i, /\.old$/i, /~$/];
const SECRET_PATTERNS = [/^\.env/i, /\.token$/i, /\.netrc$/i, /\.key$/i, /\.pem$/i, /^credentials/i];

const findings = [];

function add(message) {
  findings.push(message);
}

function folderSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const target = join(dir, entry.name);
    total += entry.isDirectory() ? folderSize(target) : statSync(target).size;
  }
  return total;
}

if (!existsSync(agentsDir)) {
  console.log('missing .agents/ folder');
  process.exit(2);
}

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  if (JUNK_PATTERNS.some((pattern) => pattern.test(entry.name))) {
    add(`junk in root: ${entry.name} -> move to .agents/temp/, then delete`);
  }
}

for (const entry of readdirSync(agentsDir, { withFileTypes: true })) {
  if (!ALLOWED.includes(entry.name)) {
    add(`unknown entry in .agents/: ${entry.name}${entry.isDirectory() ? '/' : ''} -> move to archive/`);
  }
  if (SECRET_PATTERNS.some((pattern) => pattern.test(entry.name))) {
    add(`secret-like file in .agents/: ${entry.name} -> move to env/`);
  }
}

for (const name of CORE_DOCS) {
  if (!existsSync(join(agentsDir, name))) {
    add(`missing core doc: .agents/${name}`);
  }
}

const changelogPath = join(agentsDir, 'CHANGELOG.MD');

if (existsSync(changelogPath)) {
  const content = readFileSync(changelogPath, 'utf8');
  const lines = content.split('\n').length;
  if (lines > CHANGELOG_MAX_LINES) {
    add(`CHANGELOG.MD has ${lines} lines (limit ${CHANGELOG_MAX_LINES}) -> archive old entries`);
  }
  if (!content.includes('— Model:')) {
    add('CHANGELOG.MD does not use the model-annotated version header yet');
  }
}

const size = folderSize(agentsDir);

if (size > AGENTS_MAX_BYTES) {
  add(`.agents/ is ${(size / 1024 / 1024).toFixed(1)} MB (limit 2 MB) -> clean temp/archive`);
}

if (findings.length === 0) {
  console.log('clean — .agents/ and root match the template');
  console.log(`   core docs: ${CORE_DOCS.length} · .agents size: ${(size / 1024).toFixed(0)} KB`);
  process.exit(0);
}

console.log(`${findings.length} finding(s):`);
for (const item of findings) console.log(`  - ${item}`);
process.exit(1);
