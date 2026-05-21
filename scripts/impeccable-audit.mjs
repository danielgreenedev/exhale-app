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

const result = spawnSync(runner, [
  ...runnerArgs,
  '--cache',
  localNpmCache,
  'impeccable',
  'audit',
  ...(targetArgs.length ? targetArgs : [defaultTarget]),
], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
