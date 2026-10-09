# Code Apps starter

For first-time setup or missing tools, read `.github/skills/code-app-setup/SKILL.md`.

Generated apps use React, TypeScript, Vite, the Power Apps SDK and the npm Power Apps CLI (`pa`). Use shared CSS variables in `src/styles/brand.css` for styling (under `template/src` in the generator). The palette follows Global Brand Guidelines 9.0: white and dark gray dominate, with red accents and maroon buttons. Use bundled Open Sans; do not substitute unlicensed Gotham. Keep the supplied corporate logo's proportions, white center/outline and CSS clear space. Do not invent extra logos or add app names inside the logo. This starter does not bundle the full TORO component library.

Add business logic in feature modules and use SDK-generated services for Power Platform data. Do not embed credentials in client-side code. Preserve an initialized app's identity and environment. Building is local; publishing and sharing change Power Platform resources and should follow the user's requested scope.
