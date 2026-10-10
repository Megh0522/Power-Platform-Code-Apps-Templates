---
name: code-app-data-flows
description: Add or refresh Dataverse tables, SharePoint or SQL data sources and Power Automate flows in an initialized Power Apps Code App. Collect table or flow identifiers and optionally create an unmanaged solution, add components and publish the app into it. Use for Code App integrations and solution membership, not general record import or unrelated schema authoring.
---

# Code App tables, flows and solutions

This is an agent-neutral workflow. Use the terminal, browser, user-input mechanism or authenticated platform tools available in the host. It does not require Copilot, a specific editor, an MCP server or another skill. If the host cannot execute a step, provide the exact command or portal action and state what remains unverified.

## 1. Collect the request before choosing commands

Reuse values the user already supplied. Ask for missing information in one short group, then ask branch-specific questions only when needed:

- Are we adding a table, refreshing a table's generated schema, adding a flow, refreshing a flow definition, or doing several of these?
- Which generated app folder and Power Platform environment should be used? Read the environment from `power.config.json` and show it; ask only if it is absent or conflicts with the request.
- What are the table identifiers or flow IDs? Offer discovery when the user does not know them.
- Do you want local integration only, components added to an existing solution, or a new solution created first?
- Should the Code App also be published into that solution now, or should we stop after local changes and component membership?

Use questions such as "Please provide the flow ID or its Power Automate details URL" and "Is this table in Dataverse, SharePoint or SQL? Please provide its logical name, list ID or schema-qualified table name." Do not make up IDs, choose the first search result, or ask for passwords/tokens. A user request to add an integration does not automatically authorize executing its business operation.

| Resource | Collect and use |
| --- | --- |
| Dataverse table | Logical name, for example `account` or the user's actual publisher-prefixed name; collect the Dataverse organization HTTPS URL |
| Dataverse table GUID | Confirm it is the table's metadata ID, resolve its logical name, then use that name for `pa --table`; a record ID is not a table ID |
| SharePoint list | Site URL, list identifier returned by connector discovery, connector connection or solution connection reference |
| SQL table | Dataset/database identifier, connector's table identifier such as `[dbo].[Orders]`, connection or solution connection reference |
| Power Automate flow | Flow GUID in the app's environment, obtained from discovery or the verified flow details URL |
| Existing solution | Solution GUID for `pa`, unique name for `pac`, and an unmanaged solution in the same environment |
| New solution | Display name, unique name, publisher selection, version, and description if needed |
| Connection reference | Exact logical name and the solution GUID containing it; a connection ID is a different value |

GUID inputs should have the conventional `8-4-4-4-12` hexadecimal format. Never take an environment GUID from a URL and use it as a flow or solution GUID. Preserve capitalization in connector identifiers and schema names where applicable.

## 2. Check the app and tooling

Work inside the generated app directory containing `package.json` and `power.config.json`. The generator repository containing `bin/create.mjs` is not an initialized app. If setup is missing, explain that initialization must finish first; retain any established app identity.

```text
npm run pa -- --version
npm run pa -- auth status
npm run pa -- app add data-source --help
npm run pa -- app add flow --help
```

Use the project's installed CLI. Run `npm ci` for an existing lockfile if dependencies are missing. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`; on other systems use `npm`. The command examples below are single-line arguments, so they do not depend on PowerShell backticks or Bash continuation syntax.

Verify CLI help before using version-sensitive options. Check local Git changes and keep hand-written code outside generated files. Let the developer complete `npm run pa -- auth login` and MFA when needed. Missing tenant, table, connection or flow permissions must be resolved through the account owner/administrator; do not create a replacement resource to bypass access failures.

## 3. Optional solution preparation

Perform this branch only when solution work is requested. Adding a data source to local app configuration does not itself create a solution or add the table as a solution component.

### Reuse an existing solution

```text
npm run pa -- solution list
```

Match the user's intended solution and record its GUID, unique name and environment. Verify it is unmanaged in the development environment. A display name alone can be ambiguous.

### Create a new solution

1. Open `https://make.powerapps.com` and select the app's development environment.
2. Select **Solutions > New solution**.
3. Enter the user's display name and unique name. Explain that the unique name is fixed after creation.
4. Reuse the organization's publisher selected by the user. If a new publisher is wanted, collect its display name, unique name, customization prefix and choice value prefix before creating it; do not invent a prefix.
5. Enter the requested four-part version, using `1.0.0.0` only as a proposed initial default. Save the unmanaged solution.
6. Record its GUID from the solution overview URL or CLI discovery. Verify the saved name and publisher.

If authenticated solution tooling is already available, an agent may create the same records using that documented interface and the collected values. Do not invent `pa solution create` or `pac solution create`. `pac solution init` scaffolds a local solution project; it is not equivalent to creating an online solution.

A terminal-only host can prepare these values and guide the user through the portal, then resume with the real solution ID. Do not report a solution as created without a successful result or verification.

## 4. Add a Dataverse table to the Code App

Ask: "What is the table's logical name (or metadata ID), and what is the Dataverse organization URL?"

Find a logical name in the table's properties in the maker portal. If the user supplies only a metadata GUID, resolve it through available authenticated metadata tooling. The documented read-only lookup is:

```http
GET <organization-url>/api/data/v9.2/EntityDefinitions(<table-metadata-guid>)?$select=LogicalName,SchemaName
```

Use an existing authenticated interface; do not construct a new credential flow or expose tokens. If metadata lookup is unavailable, ask the user for the logical name from table properties.

Substitute actual values before execution:

```text
npm run pa -- app add data-source --connector dataverse --table <table-logical-name> --org-url <organization-url>
```

Add one native Dataverse table per invocation. Native Dataverse does not require a connector connection ID, dataset or connection reference. Inspect the resulting table entry and generated model/service files before adding another table.

This connects an existing table; it does not create its schema, import records, grant access or include it in a solution automatically. If a table must be created, gather its schema requirements and handle that as a separate requested task in the chosen solution.

## 5. Add a SharePoint list or SQL table

Ask for connector, dataset/site/database, table/list identifier, and whether the app should use a direct connection or a solution connection reference. Use discovery to resolve unknown values:

```text
npm run pa -- connection list
npm run pa -- connection list-datasets --connector <connector-id> --connection-id <connection-id>
npm run pa -- connection list-tables --connector <connector-id> --connection-id <connection-id> --dataset <dataset-id>
```

Use the identifier returned by discovery; do not assume the UI display name is the required list/table identifier. Quote names and dataset values containing spaces. For SharePoint the dataset is normally the site URL; for SQL use the connector's actual dataset identifier.

Direct connection:

```text
npm run pa -- app add data-source --connector <connector-id> --connection-id <connection-id> --dataset <dataset-id> --table <table-id-or-name> --as table
```

Solution connection reference:

```text
npm run pa -- app add data-source --connector <connector-id> --connection-ref <reference-logical-name> --solution-id <solution-guid> --dataset <dataset-id> --table <table-id-or-name> --as table
```

For solution transport, use the existing reference the user selects. If it does not exist and creation is requested, open the chosen solution, create a **Connection reference**, select the connector and authorized connection, save, and capture its actual logical name. `--solution-id` here identifies the reference's containing solution; it does not publish the app into it.

Connector IDs such as `shared_sharepointonline` and `shared_sql` are examples; verify the selected connector. Repeat `--table` for several connector tables only when supported by installed help and all belong to the same connector/connection/dataset. Inspect partial success before retrying a failed table.

## 6. Refresh a table

Ask: "Do you mean regenerate the model after a schema change, or reload the latest records in the UI?"

For schema regeneration, identify the **existing data source name** in `power.config.json` and generated files, then run:

```text
npm run pa -- app refresh data-source --name <existing-data-source-name>
```

The refresh name is not necessarily the display name, table GUID or service class name. If the user supplied a table ID, first map it to the existing data source entry. Avoid a blanket refresh when the user requested one table. Refresh all only when explicitly requested and the installed help supports omitting `--name`.

After regeneration, review changed types and update affected callers. If a column is missing, check the correct environment and whether the relevant schema change has been published; do not silently publish all tenant customizations.

For record reload, use the existing generated service query or application's refetch mechanism. Schema refresh does not refresh business records or schedule a dataflow refresh.

## 7. Add a flow

Ask: "Please provide the flow GUID or details URL. Is it a solution-aware instant flow using the Power Apps trigger, and do you have access to its connections?"

Discover the available flows if needed:

```text
npm run pa -- app list-flows
npm run pa -- app list-flows --search <flow-name-fragment>
```

Code Apps support solution-aware instant flows with the Power Apps trigger. Scheduled, automated or other-trigger flows cannot be attached through this route. Inspect the flow's design and enabled state, rather than treating a syntactically valid GUID as proof of eligibility.

If the eligible flow is outside a solution, add it through **Solutions > the chosen solution > Add existing > Automation > Cloud flow**, selecting **Outside Dataverse** where appropriate. If no solution was requested but one is needed, explain this prerequisite and ask which solution to use. Do not create or change the flow's trigger without a request to do so.

Then use the verified flow GUID:

```text
npm run pa -- app add flow --flow-id <flow-guid>
```

Inspect the generated service, model, schema and configuration entry. Adapt the application's call site to the generated input/output types; do not invent a `Run` signature. Adding the definition is not a test execution of the flow. The underlying connections and end-user permissions need separate verification.

## 8. Refresh a flow definition

Ask for the existing flow GUID or select the matching configured entry when its identity is unambiguous. Verify the edited flow has been saved in the same environment, then repeat:

```text
npm run pa -- app add flow --flow-id <same-flow-guid>
```

Re-adding the same ID refreshes its definition. Do not invent `pa app refresh flow`, delete/re-add it, or substitute a new flow ID. Compare generated types and update renamed/removed input or response fields at call sites. Test invocation only with user-authorized inputs and scope, especially when the flow sends communications or changes records.

## 9. Add solution components when requested

In the selected unmanaged solution:

1. **Dataverse tables:** choose **Add existing > Table**, select the intended tables, and choose the needed columns/relationships and table metadata. Use segmentation for changes to existing tables; include the full required schema when a new table must be introduced downstream. Review dependency selection rather than including unrelated components.
2. **Flows:** choose **Add existing > Automation > Cloud flow** and add the verified flows. Review their connection references and dependencies.
3. **Connection references:** ensure the required references are present and bound to permitted development connections. Exporting references does not export secrets or automatically create target-environment connections.
4. **External data:** SharePoint lists and SQL tables remain in their external systems; do not treat their IDs as Dataverse table components. Package the app and relevant connection references while provisioning external resources separately.
5. **Already published Code App:** use **Add existing > App > Code app** to add it without uploading a new app build.

For an agent with the classic PAC CLI, the supported component-add route is:

```text
pac auth list
pac org who
pac solution list --environment <environment-guid-or-url>
pac solution add-solution-component --environment <environment-guid-or-url> --solutionUniqueName <solution-unique-name> --component <table-schema-name-or-metadata-guid> --componentType 1
```

PAC is separate from `pa`; its auth profile must match the intended environment. If missing and required, use the organization's approved PAC installation. For VS Code on Windows, the Power Platform Tools extension is one option; the standalone CLI is suitable for other agents. Do not require VS Code just to use this skill.

For a flow already represented as a solution-aware Dataverse workflow, component type `29` can be used with its verified **workflow component ID**. Do not assume an arbitrary Power Automate URL ID is the workflow component ID; resolve it or use the portal instead. Use `--AddRequiredComponents` only when the requested dependency scope warrants it. Do not guess component codes for Code Apps; use the dedicated portal or `pa` publication route.

Adding existing components establishes membership. It does not create tables/flows, transfer ownership, move records, grant access or export/import a solution. Verify membership in the solution after the command; do not invent `pac solution list-components`.

## 10. Build and optionally publish into the solution

Run after local code generation and caller updates:

```text
npm run typecheck
npm run build
```

Stop if either fails. Report changed files, identifiers and the solution membership verified so far. For local integration only, stop here and offer Local Play as the runtime check; do not publish automatically.

When publishing was requested, use the solution GUID collected earlier and run the push only after the build succeeds:

```text
npm run pa -- app push --solution-id <solution-guid>
```

This uploads the app build and adds it to the target solution. A solution name cannot substitute for this GUID. App, flows, Dataverse metadata and references are separate components; explicitly targeting the app's solution does not by itself include every dependency.

Review the returned app URL and solution membership. Export/import or deployment to another environment is a separate requested step, requiring connection reference bindings, environment-variable values, licenses and access in that destination. The environment may also need Code Apps enabled. Do not assume source-environment IDs survive deployment.

## 11. Completion and troubleshooting

Report the action for each resource, actual identifier, generated files, build result, verified solution membership and whether the app was published. Distinguish successful local generation from tenant/runtime checks that were not performed.

| Symptom | Check before retrying |
| --- | --- |
| Table not found | Connector, dataset, logical name/metadata mapping, environment and table permissions |
| Flow absent from discovery | Environment, solution membership, Power Apps trigger and maker/connection access |
| Definition remains stale | Saved flow version or published table metadata, correct configured entry, actual command result |
| Connection reference fails | Logical name, containing solution GUID, connector and binding permissions |
| Solution cannot be found | Environment and solution GUID versus unique/display name; PAC profile mismatch |
| CLI option is unknown | Installed version's help; do not silently install a breaking upgrade |
| Runtime access denied | End-user app, table/flow and connection permissions; report to the responsible administrator |

After a partial failure, inspect local changes and actual membership before retrying. Preserve unrelated work; do not use destructive resets or recreate an established app identity. Adding/refreshing and inspecting definitions does not authorize deleting components or executing a business flow.

## Official references

Command syntax was checked against this starter's `@microsoft/power-apps-cli` 1.2.0 and current Microsoft documentation on 10 October 2026. Consult installed help when versions change.

- [Code Apps CLI](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli)
- [Data sources and connection references](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data)
- [Dataverse table identifiers](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/retrieve-metadata-name-metadataid)
- [Add and update flows](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/add-flows)
- [Create a solution](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-solution)
- [Add existing cloud flows to a solution](https://learn.microsoft.com/en-us/power-automate/create-flow-solution)
- [PAC solution components](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/solution#pac-solution-add-solution-component)
- [Component type reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/reference/entities/solutioncomponent)
- [Code App solution publishing](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/alm)
