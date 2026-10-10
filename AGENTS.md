# Code Apps starter: agent entry points

This repository is a generator. Run `npm run create` to produce an app; work on integrations inside the generated app containing `power.config.json`.

For adding or refreshing tables and flows, or creating a solution and adding components, read `.agents/skills/code-app-data-flows/SKILL.md`. It contains the identifier questions, portable CLI commands, solution steps and verification guidance. Use it through normal skill discovery when supported, or open the file directly.

For first-time tooling and app initialization, read `.github/skills/code-app-setup/SKILL.md`. Despite its location, the setup workflow uses ordinary CLI commands. No specific agent, account connector or editor integration is required for the data/flows skill.

Follow the user's requested environment and action scope. Keep app configuration and generated services aligned with that environment. Use the project's local Power Apps CLI (`npm run pa -- ...`) and its installed help. Solution publication and flow execution are separate actions from local schema generation.
