import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI News Aggregator Bot/1.0'
  }
});

const RSS_FEEDS = [
  { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI Blog' },
  { url: 'https://www.anthropic.com/rss.xml', name: 'Anthropic Blog' },
  { url: 'https://www.technologyreview.com/feed/', name: 'MIT Technology Review' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', name: 'The Verge AI' },
  { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', name: 'Wired AI' }
];

function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        try {
          const parsed = await parser.parseURL(feed.url);
          return parsed.items.slice(0, 10).map(item => ({
            id: item.link || item.guid,
            title: item.title,
            description: item.contentSnippet || item.content?.substring(0, 200),
            url: item.link,
            image: item.enclosure?.url || extractImageFromContent(item.content),
            source: feed.name,
            publishedAt: item.pubDate || item.isoDate,
            type: 'rss'
          }));
        } catch (error) {
          console.error(`Failed to fetch ${feed.name}:`, error.message);
          return [];
        }
      })
    );

    const items = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.status(200).json({ items, source: 'rss' });
  } catch (error) {
    console.error('RSS error:', error.message);
    res.status(200).json({ error: 'Failed to fetch RSS feeds', items: [] });
  }
}
