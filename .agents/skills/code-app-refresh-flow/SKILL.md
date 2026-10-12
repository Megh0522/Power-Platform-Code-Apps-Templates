---
name: code-app-refresh-flow
description: Refresh an already connected Power Automate flow definition in a Power Apps Code App by re-adding the same flow GUID, then reconcile generated inputs, outputs and callers. Use after saved flow changes, not to run a flow, create a replacement or attach a different flow.
---

# Refresh an existing Code App flow

Use this local workflow first when a user changes a connected flow and asks to refresh its Code App integration. It works with any agent that can read files and use a terminal. Commands match this template's `@microsoft/power-apps-cli` 1.2.0, checked on 12 October 2026. Use local CLI help for differences instead of outside sources for the routine workflow.

## Identify the existing flow

Work inside the generated app containing `package.json` and `power.config.json`. Inspect existing flow entries, generated definitions and current callers before editing. Reuse the supplied flow GUID or resolve an unambiguous configured match; ask for its GUID or details URL when missing or ambiguous. A flow name or environment GUID cannot replace the flow GUID.

Confirm that the changed flow has been saved in the same environment and remains a solution-aware instant flow using the Power Apps trigger. If the user means "run the flow again" rather than refresh its definition, clarify execution inputs and intended effects instead of regenerating it.

If the requested flow is not already connected, use `../code-app-add-flow/SKILL.md`. Do not substitute a newly created flow ID for a refresh of the existing one.

## Regenerate using the same GUID

Use `npm.cmd` on Windows if needed; otherwise `npm`. Replace placeholders with actual values.

```text
npm run pa -- --version
npm run pa -- auth status
npm run pa -- app add flow --help
npm run pa -- app add flow --flow-id <existing-flow-guid>
```

Re-adding the same ID downloads the latest definition and regenerates the integration. **There is no `pa app refresh flow` command in this pinned CLI.** Do not invent that command or delete/re-add the configured entry. For several requested flows, resolve and refresh each separately; inspect partial results before retrying.

If dependencies are missing use `npm ci`. Sign-in may require `npm run pa -- auth login` and user-completed browser/MFA steps. Preserve the app ID, configured environment, connection bindings and unrelated local changes. If a command or option differs in the installed version, inspect its local help and report the mismatch instead of guessing or silently upgrading packages.

## Update callers and verify

Compare generated schemas, models, service methods, input fields and response types. Update affected hand-written callers for renamed, removed or changed inputs/outputs. Use the generated signature rather than assuming a `Run` method. Do not overwrite custom business logic in generated files or execute the flow just to prove generation succeeded.

Run `npm run typecheck` and `npm run build` after generation and caller updates. If the definition still appears stale, check the saved flow version, exact GUID/environment, trigger/response design and connection access. Do not change the flow design or create a replacement as an implicit repair.

Report the refreshed GUID, changed files, validation results and any remaining runtime checks. Definition refresh does not execute the flow, publish the app or update solution membership. Test execution requires the user's requested inputs and action scope; deployment requires a publication request and review of `power.config.json` and `code-app.deploy.json`.
