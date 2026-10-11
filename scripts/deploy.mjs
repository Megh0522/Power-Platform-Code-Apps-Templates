import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { requireNode, validateSolution, powerAppsEntry, runNode, runNpm } from './lib.mjs';

try {
  requireNode();
  const cwd = process.cwd();
  if (!existsSync(join(cwd, 'power.config.json'))) throw new Error('Initialize the app with npm run setup before deployment.');
  const settings = JSON.parse(await readFile(join(cwd, 'code-app.deploy.json'), 'utf8'));
  const solutionId = validateSolution(settings.solutionId);
  const cli = powerAppsEntry(cwd);
  console.log(solutionId
    ? `Building, then publishing into solution ${solutionId} in the environment configured in power.config.json.`
    : 'Building, then publishing with the CLI default solution behavior (no explicit solution selected).');
  runNpm(['run', 'build'], cwd);
  runNode(cli, ['app', 'push', ...(solutionId ? ['--solution-id', solutionId] : [])], cwd);
} catch (error) {
  console.error(`Deployment failed: ${error.message}`);
  process.exitCode = 1;
}
