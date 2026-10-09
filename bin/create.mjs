#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { parseArgs } from 'node:util';
import { scaffold } from '../scripts/scaffold.mjs';
import { requireNode, validateName, validateEnvironment, slugify, runNpm } from '../scripts/lib.mjs';

let prompt;
try {
  requireNode();
  const { values } = parseArgs({ options: {
    directory: { type: 'string' }, name: { type: 'string' }, environment: { type: 'string' },
    'no-install': { type: 'boolean' }, 'skip-init': { type: 'boolean' }, help: { type: 'boolean' }
  }});
  if (values.help) {
    console.log('create-takeda-code-app [--directory folder] [--name "App name"] [--environment GUID] [--no-install] [--skip-init]\nNo-install also skips platform initialization. Neither option publishes an app.');
  } else {
    prompt = createInterface({ input: stdin, output: stdout });
    const ask = async (value, question) => {
      if (value) return value;
      if (!stdin.isTTY) throw new Error('Non-interactive use requires --name, --environment and --directory.');
      return (await prompt.question(question)).trim();
    };
    const name = validateName(await ask(values.name, 'App display name: '));
    const environment = validateEnvironment(await ask(values.environment, 'Power Platform environment ID (GUID, from maker portal): '));
    let directory = values.directory;
    if (!directory) {
      if (!stdin.isTTY) throw new Error('Supply --directory for non-interactive use.');
      directory = (await prompt.question(`Destination folder [${slugify(name)}]: `)).trim() || slugify(name);
    }
    prompt.close();
    const destination = resolve(directory);
    await scaffold(resolve(dirname(fileURLToPath(import.meta.url)), '..'), destination, { name, environment });
    console.log(`Created ${destination}`);
    if (!values['no-install']) {
      runNpm(['install'], destination);
      if (!values['skip-init']) runNpm(['run', 'setup'], destination);
    }
    console.log(`Next: open "${destination}" in VS Code. ${values['no-install'] ? 'Run npm install, then npm run setup. ' : values['skip-init'] ? 'Run npm run setup. ' : ''}Use npm run dev for Power Apps Local Play, or npm run dev:web for UI-only development.`);
  }
} catch (error) {
  console.error(`Setup failed: ${error.message}\nCreated files are preserved. Fix the issue and continue inside the app folder; the installer never overwrites an existing folder.`);
  process.exitCode = 1;
} finally { prompt?.close(); }
