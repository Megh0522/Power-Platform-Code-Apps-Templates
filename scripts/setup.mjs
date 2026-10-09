import { createInterface } from 'node:readline/promises';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stdin, stdout } from 'node:process';
import { requireNode, validateName, validateEnvironment, powerAppsEntry, runNode } from './lib.mjs';

let prompt;
try {
  requireNode();
  const cwd = process.cwd();
  const cli = powerAppsEntry(cwd);
  if (existsSync(join(cwd, 'power.config.json'))) {
    console.log('This app is already initialized. Keeping its platform identity. Use npm run dev; review power.config.json before any deployment.');
  } else {
    const configPath = join(cwd, 'src', 'app.config.json');
    const config = JSON.parse(await readFile(configPath, 'utf8'));
    prompt = createInterface({ input: stdin, output: stdout });
    if (!config.displayName || !config.environmentId) {
      if (!stdin.isTTY) throw new Error('Run setup interactively to provide the app name and environment.');
      config.displayName = await prompt.question('App display name: ');
      config.environmentId = await prompt.question('Power Platform environment ID (GUID): ');
    }
    const name = validateName(config.displayName);
    const environment = validateEnvironment(config.environmentId);
    prompt.close();
    console.log(`Initializing "${name}" in environment ${environment}. Complete Microsoft sign-in/MFA in your browser if prompted.`);
    runNode(cli, ['app', 'init', '--display-name', name, '--environment-id', environment, '--app-type', 'CodeApp', '--build-path', 'dist', '--file-entry-point', 'index.html', '--app-url', 'http://localhost:5173'], cwd);
    if (!existsSync(join(cwd, 'power.config.json'))) throw new Error('CLI returned without power.config.json. Review its output and run npm run setup again.');
    await writeFile(configPath, JSON.stringify({ displayName: name, environmentId: environment }, null, 2) + '\n');
    console.log('Initialized. Run npm run dev and open the Local Play URL. Publishing is a separate npm run deploy command.');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { prompt?.close(); }
