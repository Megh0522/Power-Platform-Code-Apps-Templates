import { cp, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { validateName, validateEnvironment, slugify } from './lib.mjs';

export async function scaffold(source, destination, config) {
  const name = validateName(config.name);
  const environmentId = validateEnvironment(config.environment);
  // Exclusive creation prevents accidental writes into an existing app or checkout.
  await mkdir(destination, { recursive: false });
  await cp(join(source, 'template'), destination, {
    recursive: true,
    filter: path => !['node_modules', 'dist', '.git', 'power.config.json'].includes(basename(path)) && !basename(path).startsWith('.env')
  });
  await rename(join(destination, 'gitignore'), join(destination, '.gitignore'));
  for (const directory of ['.github', '.vscode']) {
    await cp(join(source, directory), join(destination, directory), { recursive: true });
  }
  await mkdir(join(destination, 'scripts'), { recursive: true });
  for (const file of ['lib.mjs', 'setup.mjs', 'doctor.mjs', 'web.mjs']) {
    await cp(join(source, 'scripts', file), join(destination, 'scripts', file));
  }
  const pkgPath = join(destination, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  pkg.name = slugify(name);
  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  const lockPath = join(destination, 'package-lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf8'));
  lock.name = pkg.name;
  lock.packages[''].name = pkg.name;
  await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n');
  await writeFile(join(destination, 'src', 'app.config.json'), JSON.stringify({ displayName: name, environmentId }, null, 2) + '\n');
}
