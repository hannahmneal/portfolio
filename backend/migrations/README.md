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

Three rules:

1. **Qualify every table with its schema** — `portfolio.projects`, never
   `projects`. Migrations run without the app's `search_path`, because a
   migration is what creates that schema in the first place.
2. **Never edit a migration that has already run.** It will not be re-applied;
   the runner only warns that the checksum changed. Write a new file instead.
3. **Plain `CREATE`, not `CREATE ... IF NOT EXISTS`.** If the object already
   exists, something has drifted, and the migration should fail so you are made aware.
   See below for why `001` is the exception.

## Why `001` uses `IF NOT EXISTS`

This setup replaced `db_schema.sql` because its `CREATE TABLE IF NOT EXISTS`
hid drift, yet `001_portfolio_schema.sql` uses `IF NOT EXISTS` throughout.
The difference is how often it runs.

`db_schema.sql` was re-run on every deploy, so every time a table existed in
a different shape, it was skipped without a word, indefinitely. A migration
runs once per database and is then recorded in `schema_migrations`, so it can
hide something at most once.

`001` needed the guard: it had to build a fresh database *and* adopt
production, where the tables already existed (just moved out of `public`).

It still hid drift that one time. Production's `projects` had a stray
`content` column, and `IF NOT EXISTS` skipped right past it. `003` exists to
record that column's removal. That's why new migrations use a plain `CREATE`
(rule 3).

The explanation lives here rather than in `001` itself because editing an
applied migration changes its checksum, and the runner would warn about it on
every deploy.


## Why a `portfolio` schema

This Postgres instance is shared with another project whose tables live in
`public` (`demo_bioinf_results`). Keeping this app's tables in their own schema
means neither project can collide with or accidentally drop the other's data.
Every query names the schema explicitly (`portfolio.projects`), for the app
as well as for migrations. The app used to pin `search_path=portfolio`
instead, but Neon's pooler rejects that startup parameter (see `db.js`).

