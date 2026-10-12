# Power Platform Code Apps Template

Create a new Power Apps Code App with shared Takeda styling, React, TypeScript and Vite. The installer asks for your app name, Power Platform environment ID, optional solution ID and destination folder, then installs the project dependencies and initializes the app.

## What is included

- React and TypeScript application shell with responsive styles.
- Takeda colour tokens, corporate logo and self-hosted Open Sans fonts.
- Microsoft Power Apps SDK, Vite integration and project-local Power Apps CLI.
- Setup and prerequisite-check scripts.
- A repository-local Copilot skill for onboarding and setup.
- Four focused agent-neutral skills for adding data sources, adding flows, refreshing data sources and refreshing flows, plus a combined solution/component workflow.

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
3. **Existing solution ID (optional)**, using a solution GUID from the same environment. Press Enter to skip.
4. **Destination folder**, for example `inventory-dashboard`.

The destination must be a new folder. The installer preserves existing folders and never publishes an app.

### Publish into your selected solution

Use an existing unmanaged development solution in the selected environment, with Dataverse and permissions to add app components. Open it under **Solutions** in the maker portal; its URL contains the solution GUID. After initialization, `npm.cmd run pa -- solution list` can also show solution IDs.

The installer saves your choice in `code-app.deploy.json`, separately from the browser application and Microsoft's `power.config.json`. When ready, run:

```powershell
npm.cmd run deploy
```

This builds the app and runs `pa app push --solution-id <saved-guid>`. Solution membership is established during publication; `pa app init` does not support a solution parameter. Installation validates the GUID format; the Power Apps CLI checks solution existence and access during publication. Review both configuration files before deploying, especially after changing environments.

You can edit `solutionId` in `code-app.deploy.json` later. An empty string uses the CLI's normal solution behavior. Choosing a solution does not create it or automatically add all tables, flows and dependencies; use the portable data/flows skill for those steps.

For an agent terminal or scripted installation, supply the optional `--solution` flag:

```powershell
npx.cmd --yes github:Megh0522/Power-Platform-Code-Apps-Templates --directory inventory-dashboard --name "Inventory Dashboard" --environment <environment-guid> --solution <solution-guid> --skip-init
```

Replace the angle-bracket placeholders with actual GUIDs. `--skip-init` defers platform initialization; run `npm.cmd run setup` inside the generated folder when ready to sign in. Omitting `--solution` in non-interactive use skips solution selection. These changes are available on the default branch; the original `v0.1.0` tag is unchanged.

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

## Tables, flows and solutions with any agent

Agents should use the shipped local skills first for supported integration tasks. `AGENTS.md` and the Copilot instructions route each request to its matching file; the installed CLI's help handles version differences without routine web searches.

| Activity | Local skill |
| --- | --- |
| Add data sources | [code-app-add-data-source](.agents/skills/code-app-add-data-source/SKILL.md) |
| Add flows | [code-app-add-flow](.agents/skills/code-app-add-flow/SKILL.md) |
| Refresh data sources | [code-app-refresh-data-source](.agents/skills/code-app-refresh-data-source/SKILL.md) |
| Refresh flows | [code-app-refresh-flow](.agents/skills/code-app-refresh-flow/SKILL.md) |

For example, ask your agent: "Add my Dataverse table to this app using the local add-data-source skill. Ask me for the identifiers you need." Each file contains its own inputs, commands and verification steps. Refreshing a flow re-adds its existing GUID to regenerate the definition; refreshing a data source regenerates schemas rather than reloading records.

The portable [code-app-data-flows skill](.agents/skills/code-app-data-flows/SKILL.md) works with an agent that can read Markdown and use a terminal or guide portal steps. It uses standard skill frontmatter and has no Copilot, MCP or plugin dependency. Automatic skill discovery varies by agent; `AGENTS.md` points to it, and you can always ask the agent to read it directly:

> Read .agents/skills/code-app-data-flows/SKILL.md. Help me add or refresh my Code App's tables and flows. Ask for the required table identifiers or flow IDs, and whether I want a new or existing solution and which components should be included. Do not publish unless I request it.

The skill covers native Dataverse tables, SharePoint/SQL connectors, generated schema refresh, flow definition updates, connection references, solution creation and component membership. It distinguishes Dataverse logical names from table GUIDs, and local integration from publication.

New apps generated from the current default branch receive all integration skills and `AGENTS.md`. The original `v0.1.0` tag remains unchanged. For an existing app, copy the `code-app-*` folders from `.agents/skills/` into it and merge the routing table into its existing `AGENTS.md` if present. An agent that does not load `AGENTS.md` automatically can be asked to read the appropriate skill file directly.

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
| `npm run deploy` | Build, then publish to the configured environment and saved solution, if selected |

Before running `deploy`, review the app identity and destination environment in `power.config.json` and the solution ID in `code-app.deploy.json`. Sharing, licensing and data permissions are separate tasks. The classic `pac` CLI is optional; this starter uses the npm-based `pa` CLI locally.

## Add your business logic

In your generated app:

- Add feature logic under `src/features/`.
- Add reusable components under `src/components/` as needed.
- Add hand-written integrations under `src/services/` as needed, preserving SDK-generated files in their generated locations.
- Customize the application shell in `src/App.tsx`.
- Keep shared colour and font tokens in `src/styles/brand.css`.

Add data sources with `npm.cmd run pa -- app add data-source` after confirming connector and data permissions. Avoid embedding credentials in client-side code.

**That command is a future publishing option, not the current installation command.** This repository is currently installed directly from GitHub, and its package has `private: true` to prevent accidental registry publication. Renaming `package.json` alone does not register a name with npm. A private registry or organization-scoped package can also provide a friendly command, with registry configuration and access set up for the team.

## References

- [Microsoft Code Apps quickstart](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/npm-quickstart)
- [Power Apps CLI reference](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli)
- [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [npm package specifications](https://docs.npmjs.com/cli/v11/using-npm/package-spec/)
- [npm initializer naming](https://docs.npmjs.com/cli/v11/commands/npm-init/)
