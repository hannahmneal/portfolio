-- 002_seed.sql
--
-- Minimum data so a fresh database renders something. Every insert is
-- ON CONFLICT DO NOTHING, so re-running never overwrites rows you have since
-- edited by hand — a seed is a starting point, not a reset.

INSERT INTO portfolio.users (id, name, email, profile_img_url)
VALUES ('01KT2Y0J95EATCKP7CMNEM4JZ7', 'Test', 'test@email.test', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO portfolio.projects (id, title, description, url, tags)
VALUES (
    '01KT2XWJ9G63F5JVNXQFEECYJJ',
    'Portfolio',
    'This site — React frontend, Node/Express API, deployed via Cloudflare Pages + Render + Neon.',
    'https://github.com/hannahmneal/portfolio',
    ARRAY['React', 'Node', 'Cloudflare', 'Terraform']
)
ON CONFLICT (id) DO NOTHING;
