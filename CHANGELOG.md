# Changelog

All notable changes to this project are documented in this file.

This file is maintained automatically by
[release-please](https://github.com/googleapis/release-please) from
[Conventional Commits](https://www.conventionalcommits.org/) - add entries by
writing commit messages like `feat: add contact form`, not by editing here.

The version in `version.txt`, `frontend/package.json` and
`backend/package.json` is kept in sync with the most recent release tag.

## [0.4.5](https://github.com/hannahmneal/portfolio/compare/v0.4.4...v0.4.5) (2026-11-25)


### Dependencies

* **docker:** bump node from 20-alpine to 26-alpine in /backend ([#102](https://github.com/hannahmneal/portfolio/issues/102)) ([2d94f84](https://github.com/hannahmneal/portfolio/commit/2d94f840566258b268b312b70ad6f694d5c7e46d))
* **frontend:** bump @testing-library/jest-dom from 6.9.1 to 8.0.0 in /frontend ([#109](https://github.com/hannahmneal/portfolio/issues/109)) ([2dff7c1](https://github.com/hannahmneal/portfolio/commit/2dff7c14f2f30fcdba8f75d03e325f28dde61d3a))

## [0.4.4](https://github.com/hannahmneal/portfolio/compare/v0.4.3...v0.4.4) (2026-11-25)


### Dependencies

* **backend:** bump dotenv from 17.4.2 to 18.0.10 in /backend ([#107](https://github.com/hannahmneal/portfolio/issues/107)) ([1c2a2cf](https://github.com/hannahmneal/portfolio/commit/1c2a2cf34b4330f825e2fe5046c2f6a21f5dcc57))
* **frontend:** bump the minor-and-patch group across 1 directory with 6 updates ([#108](https://github.com/hannahmneal/portfolio/issues/108)) ([3c0c44b](https://github.com/hannahmneal/portfolio/commit/3c0c44b9088b449c637a8b35a75e5ef056bd86c0))
* **frontend:** bump vitest from 4.1.12 to 5.1.1 in /frontend ([#111](https://github.com/hannahmneal/portfolio/issues/111)) ([facab65](https://github.com/hannahmneal/portfolio/commit/facab659bcd28e33095eebc069e9ba0ca11656a9))
* **terraform:** bump cloudflare/cloudflare from 5.19.1 to 5.29.0 in /terraform ([#105](https://github.com/hannahmneal/portfolio/issues/105)) ([d314e60](https://github.com/hannahmneal/portfolio/commit/d314e600f639bb7bff76ddcf4a21bf97420d5966))

## [0.4.3](https://github.com/hannahmneal/portfolio/compare/v0.4.2...v0.4.3) (2026-11-24)


### Dependencies

* **backend:** bump the minor-and-patch group in /backend with 5 updates ([#106](https://github.com/hannahmneal/portfolio/issues/106)) ([8886099](https://github.com/hannahmneal/portfolio/commit/88860993db9c4ffe49f5d6624891d6a394944be7))
* **terraform:** bump hashicorp/random from 3.9.0 to 3.9.1 in /terraform ([#103](https://github.com/hannahmneal/portfolio/issues/103)) ([eb09500](https://github.com/hannahmneal/portfolio/commit/eb09500a566daa60803345373ef56776202fb3e1))

## [0.4.2](https://github.com/hannahmneal/portfolio/compare/v0.4.1...v0.4.2) (2026-11-24)


### Bug Fixes

* **db:** serialize concurrent migration runs ([#112](https://github.com/hannahmneal/portfolio/issues/112)) ([8094cc2](https://github.com/hannahmneal/portfolio/commit/8094cc2d95baee3dba732e1708265b7be5aa105c))


### Documentation

* **db:** explain IF NOT EXISTS in migrations ([#114](https://github.com/hannahmneal/portfolio/issues/114)) ([7c2642e](https://github.com/hannahmneal/portfolio/commit/7c2642e5fcfb1d663b4254f5db6d4a4d30e34d9b))

## [0.4.1](https://github.com/hannahmneal/portfolio/compare/v0.4.0...v0.4.1) (2026-11-18)


### Bug Fixes

* **db:** name the schema in SQL instead of pinning search_path ([b206062](https://github.com/hannahmneal/portfolio/commit/b20606286aefedaa3c7e6867810023bb96e29530))

## [0.4.0](https://github.com/hannahmneal/portfolio/compare/v0.3.2...v0.4.0) (2026-11-18)


### Features

* **api:** add migrations, key scopes, and drop the /users route ([07d8265](https://github.com/hannahmneal/portfolio/commit/07d8265da3a813b480d06d77d66e2799bf50bc8f))
* **api:** added auth to API which now requires a scoped token on all routes ([fab1f4e](https://github.com/hannahmneal/portfolio/commit/fab1f4ec8092a902570a01869efc7c594fd65378))
* **api:** Adds scoped key auth for API ([8f65f7f](https://github.com/hannahmneal/portfolio/commit/8f65f7f71ce732b572f1efd403a3c3880269ded7))
* **db:** record the hand-made schema fix and drop the placeholder user ([d0f9eb7](https://github.com/hannahmneal/portfolio/commit/d0f9eb7a960cc7af297f1aeeb2151f136961a361))


### Bug Fixes

* **db:** verify the database certificate instead of accepting any ([0761807](https://github.com/hannahmneal/portfolio/commit/07618076c2aa304c07fc026fb3f472703bded748))

## [0.3.2](https://github.com/hannahmneal/portfolio/compare/v0.3.1...v0.3.2) (2026-11-11)


### Bug Fixes

* **deps:** force minimatch &gt;=11.0.1 to clear GHSA-g3hv-75wg-m249 ([aba65ef](https://github.com/hannahmneal/portfolio/commit/aba65efbfde1e69f63441fd32eddbd53c5028a82))
* **deps:** force minimatch &gt;=11.0.1 to clear GHSA-g3hv-75wg-m249 ([52f11d7](https://github.com/hannahmneal/portfolio/commit/52f11d74173134f9b8dc891d8503191cd7b968d4))

## [0.3.1](https://github.com/hannahmneal/portfolio/compare/v0.3.0...v0.3.1) (2026-11-10)


### Infrastructure

* automate versioning with release-please and private GHCR pulls ([b1a035c](https://github.com/hannahmneal/portfolio/commit/b1a035c53a55ef18d2e43943559123ea86abc4d4))
* defer GHCR registry credential to its own change ([a692c5e](https://github.com/hannahmneal/portfolio/commit/a692c5e07c920c8261643398ee0ba1dafa86301b))

## 0.3.0 (2026-10-28)

Version baseline for the `0.x` series. Before this, no `package.json` in the
repo carried a real version - the frontend sat at the Vite default `0.0.0` and
the backend at the `npm init` default `1.0.0`, and there was no changelog.

The work at this baseline was published as the
[`v1.0.0`](https://github.com/hannahmneal/portfolio/releases/tag/v1.0.0) tag,
which is retained as the historical record of that deploy:

### Infrastructure

* Infra now uses GitHub Actions, Neon, and Render ([#31](https://github.com/hannahmneal/portfolio/pull/31))

> Note: `v1.0.0` sorts above the `0.x` tags that follow it. It is kept
> deliberately; releases from 0.3.1 onward are cut by release-please, which
> reads `.release-please-manifest.json` rather than tag order, so the
> numbering sequence is unaffected.
