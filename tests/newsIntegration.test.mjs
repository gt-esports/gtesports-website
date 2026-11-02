import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import test, { before, after } from 'node:test';
import ts from 'typescript';

// Standard local Supabase default credentials & endpoints
const LOCAL_SUPABASE_URL = process.env.LOCAL_SUPABASE_URL || 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY =
  process.env.LOCAL_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const LOCAL_SUPABASE_SERVICE_ROLE_KEY =
  process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

/**
 * Validates local Supabase health and guides the developer if setup is incomplete.
 */
async function verifyLocalSupabase() {
  const configFile = new URL('../supabase/config.toml', import.meta.url);
  if (!existsSync(configFile)) {
    console.error(`
================================================================================
[!] LOCAL SUPABASE NOT INITIALIZED
================================================================================
Supabase configuration was not found at supabase/config.toml.

To initialize local Supabase, run:
  1. npx supabase init
  2. npx supabase start
  3. npx supabase db reset  (applies all migrations)
================================================================================
`);
    throw new Error('Local Supabase is not initialized. Please run "npx supabase init" and "npx supabase start".');
  }

  // Check if local Supabase REST endpoint is reachable
  try {
    const res = await fetch(`${LOCAL_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: LOCAL_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${LOCAL_SUPABASE_ANON_KEY}`,
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok && res.status !== 200) {
      throw new Error(`Endpoint returned status ${res.status}`);
    }
  } catch (err) {
    console.error(`
================================================================================
[!] LOCAL SUPABASE IS NOT RUNNING
================================================================================
Could not connect to local Supabase at ${LOCAL_SUPABASE_URL}.

Make sure Docker Desktop is running, then start your local Supabase stack:
  $ npx supabase start

If you have newly pulled migrations, apply them with:
  $ npx supabase db reset
================================================================================
`);
    throw new Error(
      `Local Supabase is not reachable at ${LOCAL_SUPABASE_URL}. Start it with "npx supabase start" (${err.message}).`
    );
  }

  // Attempt to check if news_posts table exists
  const { createClient } = await import('@supabase/supabase-js');
  const checkClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);
  const { error: tableError } = await checkClient.from('news_posts').select('id').limit(1);

  if (tableError && tableError.code === '42P01') {
    console.error(`
================================================================================
[!] LOCAL DATABASE MIGRATIONS MISSING
================================================================================
The "news_posts" table was not found in your local Supabase database.

Please apply the database migrations to your local instance:
  $ npx supabase db reset
================================================================================
`);
    throw new Error('The "news_posts" table is missing in local database. Run "npx supabase db reset".');
  }
}

await verifyLocalSupabase();

// Load and transpile src/lib/news.ts
const newsSource = await readFile(new URL('../src/lib/news.ts', import.meta.url), 'utf8');
const { outputText: newsTranspiled } = ts.transpileModule(newsSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});

const { createClient } = await import('@supabase/supabase-js');
const localAnonClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_ANON_KEY);
const localAdminClient = createClient(LOCAL_SUPABASE_URL, LOCAL_SUPABASE_SERVICE_ROLE_KEY);

// Inject local client into news module
globalThis.__realSupabaseClient = localAnonClient;
const executableSource = newsTranspiled.replace(
  /import\s*\{\s*supabase\s*\}\s*from\s*['"][^'"]+['"];?/,
  'const supabase = globalThis.__realSupabaseClient;'
);

const {
  fetchAllNewsArticles,
  fetchLimitedNews,
  fetchNewsByPage,
  fetchNewsByCategory,
  fetchNewsByAuthor,
  searchNewsByTitle,
  fetchArticleById,
  fetchArticleBySlug,
} = await import(`data:text/javascript;base64,${Buffer.from(executableSource).toString('base64')}`);

delete globalThis.__realSupabaseClient;

// Deterministic mock datasets for integration test assertions
const MOCK_ARTICLE_IDS = [
  '11111111-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000005',
];

const MOCK_POSTS = [
  {
    id: MOCK_ARTICLE_IDS[0],
    title: 'Spring Tournament Announcement',
    slug: 'spring-tournament-announcement',
    excerpt: 'Details on the upcoming collegiate esports spring tournament.',
    body: 'Registration is now open for collegiate teams across the nation.',
    author: 'Tournament Staff',
    category: 'Competition',
    cover_url: 'https://example.com/spring-tourney.jpg',
    cover_alt: 'Spring tournament banner',
    featured: true,
    status: 'published',
    published_at: new Date('2026-03-01T12:00:00Z').toISOString(),
  },
  {
    id: MOCK_ARTICLE_IDS[1],
    title: 'Community Game Night Highlights',
    slug: 'community-game-night-highlights',
    excerpt: 'Recap and photos from our monthly Discord community game night.',
    body: 'Over 100 members joined for casual matches and trivia giveaways.',
    author: 'Jane Doe',
    category: 'Community',
    cover_url: 'https://example.com/community-night.jpg',
    cover_alt: 'Community game night group photo',
    featured: false,
    status: 'published',
    published_at: new Date('2026-02-15T18:30:00Z').toISOString(),
  },
  {
    id: MOCK_ARTICLE_IDS[2],
    title: 'Annual LAN Party & Expo',
    slug: 'annual-lan-party-expo',
    excerpt: 'Tickets and schedule for the biggest collegiate LAN party of the year.',
    body: 'Bring your rig and compete in smash, valorant, and rocket league brackets.',
    author: 'Event Coordinator',
    category: 'Events',
    cover_url: 'https://example.com/lan-party.jpg',
    cover_alt: 'LAN arena setup with neon lighting',
    featured: true,
    status: 'published',
    published_at: new Date('2026-02-01T10:00:00Z').toISOString(),
  },
  {
    id: MOCK_ARTICLE_IDS[3],
    title: 'Website Overhaul Announcements',
    slug: 'website-overhaul-announcements',
    excerpt: 'New features and improvements to the GT Esports website.',
    body: 'We revamped the roster showcase, news section, and event calendar.',
    author: 'Jane Doe',
    category: 'Announcements',
    cover_url: '',
    cover_alt: '',
    featured: false,
    status: 'published',
    published_at: new Date('2026-01-20T08:00:00Z').toISOString(),
  },
  {
    id: MOCK_ARTICLE_IDS[4],
    title: 'Unpublished Draft Article',
    slug: 'unpublished-draft-article',
    excerpt: 'Work in progress draft.',
    body: 'This should not appear in public visitor queries.',
    author: 'Draft Author',
    category: 'Community',
    cover_url: '',
    cover_alt: '',
    featured: false,
    status: 'draft',
    published_at: null,
  },
];

before(async () => {
  // Clean up any stale test records from previous runs
  await localAdminClient.from('news_posts').delete().in('id', MOCK_ARTICLE_IDS);

  // Seed local database with mock posts
  const { error } = await localAdminClient.from('news_posts').insert(MOCK_POSTS);
  if (error) {
    throw new Error(`Failed to insert mock data into local database: ${error.message} (Code: ${error.code})`);
  }
});

after(async () => {
  // Clean up inserted mock data after test suite finishes
  await localAdminClient.from('news_posts').delete().in('id', MOCK_ARTICLE_IDS);
});

test('fetchAllNewsArticles returns only published mock articles ordered by published_at DESC', async () => {
  const articles = await fetchAllNewsArticles();
  assert.ok(Array.isArray(articles), 'Should return an array');

  // Verify only published articles are returned (no drafts)
  for (const article of articles) {
    assert.equal(article.status, 'published', 'Drafts should not be visible');
  }

  // Ensure mock articles are present
  const mockReturned = articles.filter((a) => MOCK_ARTICLE_IDS.includes(a.id));
  assert.equal(mockReturned.length, 4, 'Should include the 4 published mock articles');

  // Verify descending order
  for (let i = 0; i < mockReturned.length - 1; i++) {
    const current = new Date(mockReturned[i].published_at).getTime();
    const next = new Date(mockReturned[i + 1].published_at).getTime();
    assert.ok(current >= next, `Articles must be ordered descending by published_at: ${current} >= ${next}`);
  }
});

test('fetchLimitedNews respects the limit parameter', async () => {
  const limit = 2;
  const articles = await fetchLimitedNews(limit);
  assert.ok(Array.isArray(articles));
  assert.equal(articles.length, limit);

  const single = await fetchLimitedNews(1);
  assert.equal(single.length, 1);
});

test('fetchNewsByPage returns paginated subsets without overlap across sequential pages', async () => {
  const pageSize = 2;
  const page1 = await fetchNewsByPage(1, pageSize);
  const page2 = await fetchNewsByPage(2, pageSize);

  assert.equal(page1.length, pageSize);
  assert.equal(page2.length, pageSize);

  const page1Ids = new Set(page1.map((a) => a.id));
  for (const item of page2) {
    assert.ok(!page1Ids.has(item.id), `Page 2 item ${item.id} should not appear in Page 1`);
  }
});

test('fetchNewsByCategory filters strictly by category and respects optional limit', async () => {
  const category = 'Competition';
  const articles = await fetchNewsByCategory(category);

  assert.ok(Array.isArray(articles));
  assert.ok(articles.length > 0);
  for (const article of articles) {
    assert.equal(article.category, category);
  }

  const foundTournament = articles.find((a) => a.id === MOCK_ARTICLE_IDS[0]);
  assert.ok(foundTournament, 'Should find mock competition article');

  const limited = await fetchNewsByCategory(category, 1);
  assert.equal(limited.length, 1);
  assert.equal(limited[0].category, category);
});

test('fetchNewsByAuthor filters strictly by author and respects optional limit', async () => {
  const author = 'Jane Doe';
  const articles = await fetchNewsByAuthor(author);

  assert.ok(Array.isArray(articles));
  assert.ok(articles.length >= 2, 'Should find at least 2 mock articles by Jane Doe');
  for (const article of articles) {
    assert.equal(article.author, author);
  }

  const limited = await fetchNewsByAuthor(author, 1);
  assert.equal(limited.length, 1);
  assert.equal(limited[0].author, author);
});

test('searchNewsByTitle matches titles case-insensitively using pattern and respects limit', async () => {
  const term = 'tournament';
  const articles = await searchNewsByTitle(term);

  assert.ok(Array.isArray(articles));
  assert.ok(articles.length > 0);
  for (const article of articles) {
    assert.match(article.title.toLowerCase(), new RegExp(term.toLowerCase()));
  }

  const upperArticles = await searchNewsByTitle('TOURNAMENT');
  assert.equal(upperArticles.length, articles.length);

  const limited = await searchNewsByTitle(term, 1);
  assert.equal(limited.length, 1);
});

test('fetchArticleById finds existing article and returns null for non-existent ID', async () => {
  const found = await fetchArticleById(MOCK_ARTICLE_IDS[0]);
  assert.ok(found);
  assert.equal(found.id, MOCK_ARTICLE_IDS[0]);
  assert.equal(found.slug, 'spring-tournament-announcement');
  assert.equal(found.title, 'Spring Tournament Announcement');

  const notFound = await fetchArticleById('00000000-0000-0000-0000-000000000000');
  assert.equal(notFound, null);
});

test('fetchArticleBySlug finds existing article and returns null for non-existent slug', async () => {
  const found = await fetchArticleBySlug('annual-lan-party-expo');
  assert.ok(found);
  assert.equal(found.id, MOCK_ARTICLE_IDS[2]);
  assert.equal(found.title, 'Annual LAN Party & Expo');

  const notFound = await fetchArticleBySlug('non-existent-article-slug-xyz');
  assert.equal(notFound, null);
});

test('handles query errors cleanly by propagating descriptive Error messages', async () => {
  await assert.rejects(
    () => fetchArticleById('invalid-uuid-format'),
    (err) => {
      assert.ok(err instanceof Error);
      assert.match(err.message, /invalid input syntax for type uuid.*Code: 22P02/);
      return true;
    }
  );
});
