---
name: code-app-setup
description: Set up this Takeda Power Apps Code Apps starter in VS Code, check Node and Git, install project dependencies and initialize a new app in a supplied environment. Use for first-time onboarding or missing Code Apps tools.
---

# Set up the starter

This skill is self-contained. It supports a fresh machine with VS Code, Node.js and GitHub Copilot already installed; cloning the repository does not install tools or grant Power Platform access.

1. Identify the working directory. At the generator repository root, `package.json` has the `create-takeda-code-app` bin; run `npm run create` to create a new app. Inside a generated app, use its `setup`, `doctor` and `dev` scripts. Do not initialize the generator itself as a Power App.
2. Check `node --version`, `npm --version`, and `git --version`. On Windows, prefer `npm.cmd`/`npx.cmd` if PowerShell blocks npm.ps1. Node must be a supported LTS release at least 22.12. The developer already has VS Code and Copilot; avoid reinstalling them.
3. Install missing Git through the organization's approved installer or, on Windows where permitted, `winget install --id Git.Git -e --source winget`. A Node upgrade or Git installation may require restarting VS Code; explain how to resume. Do not silently change execution policy or corporate proxy settings. Private repository access requires Git authentication/SSO separately from Copilot sign-in. Never embed credentials in a Git URL.
4. For the generator, collect app display name, destination folder, Power Platform environment GUID and optional existing solution GUID in that environment. An existing folder is never a destination. In an agent terminal without interactive stdin, run `npm run create -- --directory <folder> --name "<name>" --environment <guid> --solution <solution-guid> --skip-init`, then continue in that folder. Omit `--solution` if no solution was requested. Omit `--skip-init` only if a human can handle the browser login and any CLI prompts. The solution is saved in `code-app.deploy.json`; it is applied by `npm run deploy` during publication, not by initialization. Selecting a solution does not authorize publishing or create the solution. Review its ID and `power.config.json` before any requested deployment.
5. Inside the app, `npm install` installs the pinned React, Vite, SDK, Vite integration and Power Apps CLI locally. A global PAC installation is not required. For a lockfile already committed by the team, prefer `npm ci`.
6. Run `npm run doctor`, then `npm run setup`. The setup script validates the name/environment and invokes `pa app init`. Authentication and MFA are human actions: let the developer complete them; do not collect credentials. If the platform config exists, retain it and inspect it rather than replacing the app ID or environment.
7. Run `npm run typecheck` and `npm run build`. Run `npm run dev` for Power Apps Local Play. Use `npm run dev:web` only for UI work without platform authentication. If tenant access blocks initialization, explain the exact missing prerequisite and keep local files intact.

Environment provisioning, Code Apps enablement, maker permissions, licensing, connector access and corporate network policies are administrator/developer tasks; cloning or installing the template does not grant them. This skill supports the user's setup request; it does not automatically authorize deployment, sharing or changing tenant settings.

Ask for the development environment GUID and confirm access in `https://make.powerapps.com`. An administrator enables Code Apps under Power Platform admin center > Manage > Environments > the selected environment > Settings > Product > Features. The developer must complete Microsoft sign-in and MFA. Open Local Play in the same work browser profile and permit local network access where organizational policy allows.

If the user specifically needs the classic Power Platform CLI, install it separately using the approved installer or VS Code's Power Platform Tools extension: `code --install-extension microsoft-IsvExpTools.powerplatform-vscode`. Restart the integrated terminal and verify `pac --version`. PAC is optional for this starter; do not install .NET or mix CLI workflows merely to build a Code App.

For branding, use the bundled Open Sans fonts and CSS palette. Preserve the corporate logo and its clear space; do not recreate it as text. Runtime assets follow the supplied Global Brand Guidelines 9.0, while the full PDF and standalone instructions are intentionally absent from the repository. Generated app names should describe their business purpose.

Use `npm run pa -- --help` and Microsoft's current [CLI reference](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli) for data-source or CLI work. PAC (`pac`) is a separate Power Platform CLI; do not mix `pac code` syntax with `pa app` syntax.
