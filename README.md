# portfolio

| Package | Version | 
| --- | --- |
| Node | 25.6.1 |
| npm | 11.1.0 |
| Terraform | 1.15.5 (ARM 64) |
| Vite | 9.0.7 |

To run: `npm run dev`

---

# Versioning

Versioning was established and automated with [PR chore(main): release 0.3.1 #69](https://github.com/hannahmneal/portfolio/pull/69) using `release-please`. To keep things tidy and ensure *correct* 🤖 versioning, PR titles should follow this format:

Type must be lowercase, followed by `:`  (colon-space). Scope is free-form and optional (e.g., `fix(deps):`, `feat(frontend):`) and doesn't affect which section it lands in.
```<type>(<optional scope>): <summary>```
Examples: 
`infra: automate deployments for frontent` --> This would *not* increase the *existing* version.
`feat(deps): remove unused packages` --> This *would* affect the versioning because `feat` is configured to do so (`release-please-config.json`), but it also emphasizes `deps` which isn't. Below is a table to summarize:


|Type   | Changelog section |	Version effect at 0.3.1 |
|-|-|---|
|feat:	| Features |	0.4.0 (minor) |
|fix:	| Bug | Fixes	0.3.2 (patch) |
|deps:	| Dependencies |	⚠️ none |
|infra:	| Infrastructure |	⚠️ none |
|docs:	| Documentation |	⚠️ none |
|refactor:	| Refactoring |	⚠️ none |
|test:	| hidden |	none |
|chore:	| hidden |	none |

Anything else — `update:`, `wip:` — is ignored entirely: no changelog entry, no bump.

## Important  🚨

Only `feat:` and `fix:` trigger a release. The others will generate tidy changelog sections but *no version bump* and therefore *no deploy*. So follow the instructions above. One more time:

- `fix(deps): bump packages to resolve CVEs`
- `deps: bump package` -> changelog only, no release

## PR Titles

Release-please parses PR titles so a PR titled `dev` parses as nothing. Although this repo preserves individual commits because it uses merge commits (instead of squash-merging), it isn't as problematic but PRs should still be named conventionally.

## Breaking changes

`feat!:` or a `BREAKING CHANGE:` footer. Note `bump-minor-pre-major: true` is set in the release-please-config, so while you're on `0.x` a breaking change bumps *minor* `(0.4.0)`, not major. You stay pre-1.0 until you explicitly choose otherwise

---