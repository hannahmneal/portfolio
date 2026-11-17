# Migrations

Forward-only SQL migrations. `db_schema.sql` used to live here in spirit — it
was replaced because `CREATE TABLE IF NOT EXISTS` silently does nothing against
an existing database, which is how the live schema drifted (a stray `content`
column, and `contact_messages` never created) without anything ever failing.

## Running

```bash
npm run migrate:dry   # list what would be applied, change nothing
npm run migrate       # apply pending migrations
```

Applied files are recorded in `portfolio.schema_migrations`. Re-running is
safe: applied files are skipped.

## Adding one

Create `NNN_short_name.sql` with the next number. Files run in filename order,
each in its own transaction.

Two rules:

1. **Qualify every table with its schema** — `portfolio.projects`, never
   `projects`. Migrations run without the app's `search_path`, because a
   migration is what creates that schema in the first place.
2. **Never edit a migration that has already run.** It will not be re-applied;
   the runner only warns that the checksum changed. Write a new file instead.

## Why a `portfolio` schema

This Postgres instance is shared with another project whose tables live in
`public` (`demo_bioinf_results`). Keeping this app's tables in their own schema
means neither project can collide with or accidentally drop the other's data.
The app connects with `search_path=portfolio` (see `db.js`), so an unqualified
query in a route can only ever resolve to this app's tables.
