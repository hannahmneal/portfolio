-- 003_drop_projects_content.sql
--
-- Records a change that was previously made by hand.
--
-- The live database had grown a `content` jsonb column on projects that no
-- code ever read or wrote — the drift that motivated this whole migration
-- setup. It was dropped directly, in a one-off transaction, before the runner
-- existed. That left the two databases with the same shape but different
-- histories: a database built from 001 + 002 never had the column, while
-- production had it and lost it through a change nothing recorded.
--
-- This file closes that gap. It is a no-op on both databases today, which is
-- the point: after it runs, portfolio.schema_migrations is a complete account
-- of how the schema reached its current shape, with nothing taken on trust.
--
-- IF EXISTS rather than a bare DROP, so this is safe on a fresh database where
-- the column was never created.

ALTER TABLE portfolio.projects DROP COLUMN IF EXISTS content;
