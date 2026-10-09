# Power Platform Code Apps Template

Create a new Power Apps Code App with shared Takeda styling, React, TypeScript and Vite. The installer asks for your app name, Power Platform environment ID and destination folder, then installs the project dependencies and initializes the app.

## What is included

- React and TypeScript application shell with responsive styles.
- Takeda colour tokens, corporate logo and self-hosted Open Sans fonts.
- Microsoft Power Apps SDK, Vite integration and project-local Power Apps CLI.
- Setup and prerequisite-check scripts.
- A repository-local Copilot skill for onboarding and setup.

The branding uses the supplied Global Brand Guidelines 9.0. This starter does not include the full TORO component library. Reference PDFs and standalone setup documents are excluded from the repository.

## Before you start

You need VS Code, GitHub Copilot, Git and a supported Node.js LTS release (at least 22.12). Check your installation:

```powershell
node --version
npm.cmd --version
git --version
```

Your Power Platform development environment must have Code Apps enabled, and your account must have the required maker permissions and licensing. Obtain its **environment ID (GUID)** from the maker portal or your administrator. A friendly environment name or Dataverse URL cannot be used in the installer.

The installer cannot grant access or enable environment features for you. Complete Microsoft sign-in and MFA in your browser when prompted. Private repository access also requires Git credentials, separately from Copilot sign-in.

## Create an app directly from GitHub

Open a terminal in the parent folder where you want the new app to be created:

```powershell
npx.cmd --yes github:Megh0522/Power-Platform-Code-Apps-Templates
```

This shorter GitHub form omits `.git` and the version tag and follows the repository's default branch. On macOS/Linux, use `npx` instead of `npx.cmd`.

Answer these prompts:

1. **App display name**, for example `Inventory Dashboard`.
2. **Power Platform environment ID**, using your development environment GUID.
3. **Destination folder**, for example `inventory-dashboard`.

The destination must be a new folder. The installer preserves existing folders and never publishes an app.

To use the fixed initial release instead:

```powershell
npm.cmd exec --yes --package="git+https://github.com/Megh0522/Power-Platform-Code-Apps-Templates.git#v0.1.0" -- create-takeda-code-app
```

The tag keeps the template version fixed. Omit it when you intend to use the default branch.

## Open and run your app

After generating `inventory-dashboard`:

```powershell
cd inventory-dashboard
code .
npm.cmd run doctor
npm.cmd run dev
```

Open the **Local Play** URL in the same browser profile used for your Power Platform tenant. Allow local network access if your organization's browser policy permits it.

If dependency installation or initialization was skipped or interrupted, continue inside the generated app:

```powershell
npm.cmd install
npm.cmd run setup
```

For UI-only development before platform authentication, use `npm.cmd run dev:web`. This mode does not verify Power Apps connectors or authenticated runtime behavior.

## Use Copilot for setup

Open the generated app in VS Code and ask Copilot in Agent mode:

> Read .github/skills/code-app-setup/SKILL.md, check my prerequisites, install missing project dependencies, initialize this app in my development environment and verify the build. Tell me when I need to complete sign-in or contact an administrator. Do not publish yet.

The skill is self-contained and travels with every generated app. You can also select `/code-app-setup` if your VS Code version lists the skill. Skills provide instructions; they do not run an installer automatically when you clone a repository.

## App commands

Run these inside the generated app, not inside this generator repository:

| Command | Purpose |
| --- | --- |
| `npm run setup` | Initialize a fresh app while preserving an existing platform configuration |
| `npm run doctor` | Check Node, Git, CLI and platform configuration presence |
| `npm run dev` | Start Vite with Power Apps integration and Local Play |
| `npm run start` | Start the same development server through the Power Apps CLI |
| `npm run dev:web` | Start the UI without Power Apps integration |
| `npm run typecheck` | Check TypeScript |
| `npm run build` | Build production assets in `dist/` |
| `npm run pa -- --help` | Use the project-local Power Apps CLI |
| `npm run deploy` | Build, then publish to the configured Power Platform environment |

Before running `deploy`, review the app identity and destination environment in `power.config.json`. Sharing, licensing and data permissions are separate tasks. The classic `pac` CLI is optional; this starter uses the npm-based `pa` CLI locally.

## Add your business logic

In your generated app:

- Add feature logic under `src/features/`.
- Add reusable components under `src/components/` as needed.
- Add hand-written integrations under `src/services/` as needed, preserving SDK-generated files in their generated locations.
- Customize the application shell in `src/App.tsx`.
- Keep shared colour and font tokens in `src/styles/brand.css`.

Add data sources with `npm.cmd run pa -- app add data-source` after confirming connector and data permissions. Avoid embedding credentials in client-side code.

Commit your generated app's lockfile and use `npm ci` for repeatable installation. The starter excludes `power.config.json` from Git to avoid passing one app's platform identity to every new project; a team may deliberately version a reviewed configuration for a specific shared app.

## Clone the generator instead

```powershell
git clone https://github.com/Megh0522/Power-Platform-Code-Apps-Templates.git
cd Power-Platform-Code-Apps-Templates
npm.cmd run create
```

Open the new app folder after generation. Cloning this repository or using GitHub's template button does not itself display setup prompts.

For Copilot or automated terminals without interactive input:

```powershell
npm.cmd run create -- --directory ../inventory-dashboard --name "Inventory Dashboard" --environment YOUR-ENVIRONMENT-GUID --skip-init
```

Replace `YOUR-ENVIRONMENT-GUID` with a real GUID. `--skip-init` installs dependencies but leaves platform initialization for later. `--no-install` skips both installation and initialization.

## Can the install command use only a friendly name?

Yes, after publishing the initializer to an npm registry. Publishing a package named `create-takeda-code-app` would make this possible:

```powershell
npm.cmd create takeda-code-app
```

**That command is a future publishing option, not the current installation command.** This repository is currently installed directly from GitHub, and its package has `private: true` to prevent accidental registry publication. Renaming `package.json` alone does not register a name with npm. A private registry or organization-scoped package can also provide a friendly command, with registry configuration and access set up for the team.

## References

- [Microsoft Code Apps quickstart](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/npm-quickstart)
- [Power Apps CLI reference](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli)
- [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [npm package specifications](https://docs.npmjs.com/cli/v11/using-npm/package-spec/)
- [npm initializer naming](https://docs.npmjs.com/cli/v11/commands/npm-init/)
