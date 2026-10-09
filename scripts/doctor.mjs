import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { requireNode, powerAppsEntry, runNode } from './lib.mjs';
try {
  requireNode();
  console.log(`Node ${process.versions.node}: OK`);
  const git = spawnSync('git', ['--version'], { encoding: 'utf8', shell: false });
  if (git.status !== 0) throw new Error('Git is missing from PATH. Install Git and restart VS Code.');
  console.log(git.stdout.trim());
  runNode(powerAppsEntry(process.cwd()), ['--version'], process.cwd());
  console.log(existsSync('power.config.json') ? 'Platform configuration: present' : 'Platform configuration: missing; run npm run setup.');
  console.log('Environment permissions, Code Apps enablement, MFA and licensing must be checked with your Power Platform administrator.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
