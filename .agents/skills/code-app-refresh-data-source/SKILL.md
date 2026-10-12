---
name: code-app-refresh-data-source
description: Refresh generated schemas, models and services for existing Power Apps Code App data sources after table or connector changes. Resolve configured source names and update affected callers. Distinguish schema regeneration from reloading records; do not add a new source for an existing integration.
---

# Refresh an existing Code App data source

Use this local workflow first for table or data-source refresh requests. It works with any agent that can read files and use a terminal. Commands match this template's `@microsoft/power-apps-cli` 1.2.0, checked on 12 October 2026. Use installed help for version differences instead of outside sources for this routine task.

## Resolve what needs refreshing

Work inside the generated app containing `package.json` and `power.config.json`. Read the existing source entries and generated files; preserve app identity and unrelated changes.

If the meaning is unclear, ask: "Do you want to regenerate the model after a schema change, or reload the latest records in the UI?" Reuse the user-provided source identity; ask only when missing or ambiguous.

For schema regeneration, identify the **configured data source name**. It is not necessarily the table display name, metadata GUID or generated service class. If the user supplies a table/list ID, map it to the existing configured entry. If it is not connected yet, read `../code-app-add-data-source/SKILL.md` rather than inventing a refresh target.

Confirm which sources should be refreshed: one, a specified set, or all. A request for one source does not authorize a blanket refresh.

## Refresh schema definitions

Use `npm.cmd` on Windows if needed; otherwise `npm`. Replace placeholders with actual names and quote names containing spaces.

```text
npm run pa -- --version
npm run pa -- auth status
npm run pa -- app refresh data-source --help
npm run pa -- app refresh data-source --name <configured-source-name>
```

If dependencies are missing use `npm ci`. Sign-in may require `npm run pa -- auth login` and user-completed browser/MFA steps. Use the configured app environment; do not reinitialize or switch environments to make a missing source appear.

For a specified set, run once per verified source name and inspect each result. Only when all sources are requested, omit `--name`:

```text
npm run pa -- app refresh data-source
```

Review partial successes before retrying. Do not delete and recreate sources, change connections or overwrite hand-written services just to force regeneration.

## Reconcile schema changes

Compare the generated models, schemas, service methods and configuration before and after refresh. Update callers for renamed or removed columns, changed types and action signatures. Keep custom code outside generated files. If a column remains missing, check the source/environment, saved and published metadata, and permissions. Do not silently publish all tenant customizations or recreate a table.

Run `npm run typecheck` and `npm run build` after regeneration and caller updates. Report the refreshed source names, changed files, checks and outstanding runtime verification. Local refresh does not publish the app, add solution components or migrate records. If publication is requested, review `power.config.json` and the saved target in `code-app.deploy.json` before deploying.

## Reload current records instead

For UI record reload, inspect the existing generated query and application state/cache. Use the application's refetch or reload mechanism and preserve its filters, paging and loading/error handling. The schema CLI does not reload business records or refresh a Power Platform dataflow. If the user means a dataflow refresh, clarify that different resource and workflow.
