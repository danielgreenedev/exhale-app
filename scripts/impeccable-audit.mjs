import { existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';

const defaultTarget = 'http://127.0.0.1:3000/';
const targetArgs = process.argv.slice(2);
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const env = { ...process.env };
if (!env.PUPPETEER_EXECUTABLE_PATH && process.platform === 'win32' && existsSync(chromePath)) {
  env.PUPPETEER_EXECUTABLE_PATH = chromePath;
}
const localNpmCache = join(process.cwd(), '.npm-cache');
mkdirSync(localNpmCache, { recursive: true });
env.npm_config_cache = localNpmCache;
env.NPM_CONFIG_CACHE = localNpmCache;

const npmBinDir = dirname(process.execPath);
const npxCli = join(npmBinDir, 'node_modules', 'npm', 'bin', 'npx-cli.js');
const runner = existsSync(npxCli) ? process.execPath : process.platform === 'win32' ? 'npx.cmd' : 'npx';
const runnerArgs = existsSync(npxCli) ? [npxCli] : [];
const forwardedArgs = targetArgs.filter((arg) => arg !== '--json');

const result = spawnSync(runner, [
  ...runnerArgs,
  '--cache',
  localNpmCache,
  'impeccable',
  'detect',
  '--json',
  ...(forwardedArgs.length ? forwardedArgs : [defaultTarget]),
], {
  cwd: process.cwd(),
  env,
  encoding: 'utf8',
  shell: false,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.stderr) process.stderr.write(result.stderr);

let findings;
try {
  findings = JSON.parse(result.stdout || '[]');
  if (!Array.isArray(findings)) throw new Error('Expected an array of findings');
} catch {
  if (result.stdout) process.stdout.write(result.stdout);
  process.exit(result.status ?? 1);
}

function isIgnoredDevPortalFinding(finding) {
  return finding?.antipattern === 'design-system-color'
    && typeof finding?.snippet === 'string'
    && finding.snippet.includes('nextjs-portal');
}

const appFindings = findings.filter((finding) => !isIgnoredDevPortalFinding(finding));
const ignoredCount = findings.length - appFindings.length;

if (appFindings.length === 0) {
  console.log('No app anti-patterns found.');
  if (ignoredCount > 0) {
    console.log(`Ignored ${ignoredCount} Next.js dev overlay finding outside the Exhale UI.`);
  }
  process.exit(0);
}

const byFile = new Map();
for (const finding of appFindings) {
  const file = finding.file || 'unknown target';
  byFile.set(file, [...(byFile.get(file) ?? []), finding]);
}

for (const [file, fileFindings] of byFile) {
  console.log(`\n${file}`);
  for (const finding of fileFindings) {
    console.log(`  [${finding.antipattern}] ${finding.snippet}`);
    if (finding.description) {
      console.log(`    -> ${finding.description}`);
    }
  }
}
console.log(`\n${appFindings.length} anti-pattern${appFindings.length === 1 ? '' : 's'} found.`);
if (ignoredCount > 0) {
  console.log(`Ignored ${ignoredCount} Next.js dev overlay finding outside the Exhale UI.`);
}

process.exit(result.status && result.status !== 0 ? result.status : 1);
