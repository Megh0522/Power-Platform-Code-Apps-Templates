# Code Apps starter: agent entry points

This repository is a generator. Run `npm run create` to produce an app; work on integrations inside the generated app containing `power.config.json`.

When the user requests a data-source or flow activity, read the matching local skill before choosing commands:

| User request | Skill file |
| --- | --- |
| Add a table, list, connector or data source | `.agents/skills/code-app-add-data-source/SKILL.md` |
| Add a Power Automate flow | `.agents/skills/code-app-add-flow/SKILL.md` |
| Refresh a data source's generated schema | `.agents/skills/code-app-refresh-data-source/SKILL.md` |
| Refresh a connected flow's definition | `.agents/skills/code-app-refresh-flow/SKILL.md` |
| Create a solution, add components or coordinate several integrations | `.agents/skills/code-app-data-flows/SKILL.md` |

Use the local skill and installed CLI help as the first sources for these workflows; do not search outside sources for routine commands already covered here. Each focused skill is self-contained, asks for missing identifiers and explains verification. Automatic discovery varies by agent, so open the listed file directly when needed. If installed help conflicts with a skill, report the version mismatch and use the supported local syntax rather than guessing or silently upgrading.

For first-time tooling and app initialization, read `.github/skills/code-app-setup/SKILL.md`. Despite its location, the setup workflow uses ordinary CLI commands. No specific agent, account connector or editor integration is required for the data/flows skill.

Follow the user's requested environment and action scope. Keep app configuration and generated services aligned with that environment. Use the project's local Power Apps CLI (`npm run pa -- ...`) and its installed help. Solution publication and flow execution are separate actions from local schema generation.
