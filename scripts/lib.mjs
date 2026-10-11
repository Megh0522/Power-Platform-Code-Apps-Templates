import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

export function requireNode() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('Install a supported Node.js LTS version, at least 22.12.');
}
export function validateName(value) {
  const name = value.trim();
  if (!name || name.length > 100 || /[\x00-\x1f\x7f]/.test(name)) throw new Error('App name must contain 1-100 printable characters.');
  return name;
}
export function validateEnvironment(value) {
  const id = value.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error('Use the Power Platform environment GUID, not the friendly name or Dataverse URL.');
  return id;
}
export function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'takeda-code-app';
}
export function validateSolution(value = '') {
  if (typeof value !== 'string') throw new Error('Solution ID must be a GUID or an empty string.');
  const id = value.trim();
  if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error('Use the solution GUID, not its display or unique name; leave blank to skip.');
  return id;
}
export function runNode(file, args, cwd) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd, stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Command exited with ${result.status ?? result.signal}: ${file}`);
}
export function runNpm(args, cwd) {
  const candidates = [
    process.env.npm_execpath && join(dirname(process.env.npm_execpath), 'npm-cli.js'),
    join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    join(dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js')
  ].filter(Boolean);
  const npm = candidates.find(existsSync);
  if (!npm) throw new Error('Cannot locate npm-cli.js. Start the creator using npm exec or npm run create.');
  runNode(npm, args, cwd);
}
export function powerAppsEntry(cwd) {
  const require = createRequire(join(cwd, 'package.json'));
  let entry;
  try { entry = require.resolve('@microsoft/power-apps-cli'); }
  catch {
    const pkgPath = join(cwd, 'node_modules', '@microsoft', 'power-apps-cli', 'package.json');
    if (!existsSync(pkgPath)) throw new Error('Power Apps CLI is missing. Run npm install first.');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return join(dirname(pkgPath), typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.pa);
  }
  // Use the package bin, not its library entry point.
  let directory = dirname(entry);
  for (let level = 0; level < 5; level++) {
    const pkgPath = join(directory, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg.name === '@microsoft/power-apps-cli') return join(directory, typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.pa);
    }
    directory = dirname(directory);
  }
  throw new Error('Cannot locate Power Apps CLI executable. Run npm install.');
}
