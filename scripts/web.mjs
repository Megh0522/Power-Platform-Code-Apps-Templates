import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
const require = createRequire(join(process.cwd(), 'package.json'));
const vite = join(dirname(require.resolve('vite/package.json')), 'bin', 'vite.js');
const child = spawn(process.execPath, [vite, '--host', '127.0.0.1'], {
  stdio: 'inherit', shell: false, env: { ...process.env, POWER_APPS_UI_ONLY: '1' }
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
