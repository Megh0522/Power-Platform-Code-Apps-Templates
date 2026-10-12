---
name: code-app-add-flow
description: Add an existing eligible Power Automate flow to an initialized Power Apps Code App using its flow GUID. Collect the flow ID, check environment and solution prerequisites, generate services and adapt callers. Use for new flow integrations, not refreshing an already connected flow or running its business operation.
---

# Add a Code App flow

Use this local workflow first for a request to attach a Power Automate flow. Any agent that can read Markdown and use a terminal can follow it; no editor or platform plugin is required. Commands match this template's `@microsoft/power-apps-cli` 1.2.0, checked on 12 October 2026. Use installed help for differences instead of outside sources for the routine workflow.

## Collect the flow identity

Work in the generated app with `package.json` and `power.config.json`. Read the app's environment and existing flow entries first. Ask for missing inputs:

- The flow GUID or Power Automate details URL. Extract the flow ID, not the environment ID, from a verified URL.
- Is the flow in the app's environment, solution-aware, and an instant flow using the Power Apps trigger?
- Does the developer have access to the flow and its underlying connections?
- If membership is missing, which existing solution should contain the flow, or is a new solution requested?

Reuse known values. Never select the first ambiguous search result or invent a flow ID. If this flow is already connected and needs an updated definition, read `../code-app-refresh-flow/SKILL.md`.

## Check prerequisites and discover

Use `npm.cmd` on Windows if needed; otherwise `npm`. Replace placeholders with actual values and quote names containing spaces.

```text
npm run pa -- --version
npm run pa -- auth status
npm run pa -- app add flow --help
npm run pa -- app list-flows
npm run pa -- app list-flows --search <flow-name-fragment>
```

If dependencies are missing use `npm ci`; if app initialization is missing use the shipped setup skill. Sign-in can require `npm run pa -- auth login` and user-completed browser/MFA steps. Preserve existing app identity and local changes.

Code Apps support solution-aware instant flows with the Power Apps trigger through this route. Inspect the selected flow's design, saved version and enabled state; a valid GUID alone is insufficient. Scheduled, automated or other-trigger flows cannot be attached through this workflow. Do not change their trigger or create a replacement without a user request.

If the eligible flow is outside a solution and membership is requested, use **Solutions > selected unmanaged solution > Add existing > Automation > Cloud flow**, selecting **Outside Dataverse** where appropriate. Read `../code-app-data-flows/SKILL.md` for solution creation or detailed component steps. Record the actual solution and flow GUIDs. A terminal-only agent can guide portal steps and resume when the user supplies the result.

The installer-selected solution in `code-app.deploy.json` is a publication target; it does not automatically make a flow solution-aware or include dependencies.

## Generate the integration

```text
npm run pa -- app add flow --flow-id <flow-guid>
```

The CLI downloads the flow definition, generates TypeScript models/services, and records the flow and references in `power.config.json`. Inspect those actual files and reference bindings. Build the caller using the generated input/output signature; do not assume a method named `Run` or hard-code an unverified endpoint. Keep hand-written business logic outside generated files.

## Verify and finish

Run `npm run typecheck` and `npm run build` after generation and caller changes. Report the flow ID, environment, generated files, checks and any access or eligibility issue. Adding a definition does not run the flow or grant end-user access.

Execute a test invocation only when the user has requested it with suitable inputs and scope, especially for flows that send messages or change records. Publishing is a separate action: if requested, review `power.config.json` and `code-app.deploy.json` before `npm run deploy`. Local flow integration does not automatically publish the app or add every dependency to its solution.
