---
name: code-app-add-data-source
description: Connect an existing Dataverse table, SharePoint list, SQL table or connector action to an initialized Power Apps Code App. Ask for identifiers and generate local services with the project CLI. Use for adding integrations, not creating tables or refreshing existing schemas.
---

# Add a Code App data source

Use this local workflow first when a user asks to add a table, list, connector or data source. It is portable to any agent that can read files and run commands; no Copilot, MCP or editor plugin is required. Commands match this template's `@microsoft/power-apps-cli` 1.2.0, checked on 12 October 2026. Use installed help for version differences instead of searching outside sources for the routine workflow.

## Identify the app and inputs

Work in the generated app containing `package.json` and `power.config.json`, not the generator root. Read the configured environment and existing sources; preserve the app identity and unrelated changes. Reuse supplied values. Ask for only missing inputs:

- Which system: Dataverse, SharePoint, SQL or another connector?
- What table/list identifier or connector action is required?
- For connector-backed data, which connection ID or connection reference should be used?
- If solution membership or a new solution is wanted, which solution and components? That workflow is in `../code-app-data-flows/SKILL.md`; local source generation alone does not add components.

Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`; otherwise use `npm`. All placeholders below must be replaced with actual values. Quote values containing spaces.

```text
npm run pa -- --version
npm run pa -- auth status
npm run pa -- app add data-source --help
```

If dependencies are missing, install from the lockfile with `npm ci`. If not initialized, use the shipped setup skill before adding integrations. When sign-in is needed, use `npm run pa -- auth login` and let the user complete browser sign-in/MFA. Never request passwords or tokens.

## Dataverse table

Ask for the table's **logical name**, for example `account`, and Dataverse organization HTTPS URL. If a table GUID is supplied, confirm it is the table metadata ID rather than a row ID and resolve the logical name from available authenticated metadata tooling or ask the user for table properties. Do not pass a GUID to `--table` for native Dataverse.

```text
npm run pa -- app add data-source --connector dataverse --table <table-logical-name> --org-url <organization-url>
```

Add one native Dataverse table per invocation. This path needs no connection ID, connection reference or dataset. It uses existing table metadata; it does not create a table, import rows or grant access.

## SharePoint list or SQL table

Collect the connector identifier, dataset and exact table/list identifier. SharePoint normally uses the site URL as its dataset. SQL uses the dataset identifier returned by the connector and a table identifier such as `[dbo].[Orders]`. Do not guess IDs from display names.

Discover missing connection, dataset and table values locally:

```text
npm run pa -- connection list
npm run pa -- connection list-datasets --connector <connector-id> --connection-id <connection-id>
npm run pa -- connection list-tables --connector <connector-id> --connection-id <connection-id> --dataset <dataset-id>
```

For a direct connection:

```text
npm run pa -- app add data-source --connector <connector-id> --connection-id <connection-id> --dataset <dataset-id> --table <table-id-or-name> --as table
```

For an existing solution connection reference, ask for its **logical name** and the GUID of its containing solution, both in the app's environment:

```text
npm run pa -- connection list-references --solution-id <solution-guid>
npm run pa -- app add data-source --connector <connector-id> --connection-ref <reference-logical-name> --solution-id <solution-guid> --dataset <dataset-id> --table <table-id-or-name> --as table
```

`shared_sharepointonline` and `shared_sql` are example connector IDs; verify the selected connector. `--solution-id` here locates the connection reference, not app publication. `code-app.deploy.json` holds the app's deployment solution, which may differ from the reference's containing solution.

Repeat `--table` only for requested tables sharing the same connector, connection and dataset. Inspect succeeded and failed items before retrying a partial result.

## Connector actions or SQL stored procedures

For a connector exposing actions and tables, explicitly choose actions when that is the request:

```text
npm run pa -- app add data-source --connector <connector-id> --connection-id <connection-id> --as action
```

For action-only connectors, omit `--as action` if installed help indicates it is unsupported. Do not combine action mode with table, dataset or procedure flags. For a requested SQL procedure, collect its actual identifier and use the table mode:

```text
npm run pa -- app add data-source --connector shared_sql --connection-id <connection-id> --dataset <dataset-id> --procedure <procedure-name> --as table
```

## Verify and finish

Inspect the source entry in `power.config.json` and generated schemas, models and services. Use actual generated method signatures in hand-written call sites; avoid edits inside generated files. If the source already exists and the request is a schema update, use `../code-app-refresh-data-source/SKILL.md` instead.

Run `npm run typecheck` and `npm run build` after generation and caller changes. Report the source identifiers, changed files, validation results and anything blocked by permissions. Do not silently create replacement resources, publish the app, execute connector actions or change records just to test the integration. Runtime checks require the user's intended inputs and action scope.
