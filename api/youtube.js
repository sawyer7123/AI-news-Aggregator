import axios from 'axios';

const SEARCH_QUERIES = [
  'AI news today',
  'ChatGPT update',
  'artificial intelligence news'
];

export default async function handler(req, res) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ items: [], source: 'youtube', message: 'YOUTUBE_API_KEY not configured' });
    }

    const publishedAfter = new Date();
    publishedAfter.setDate(publishedAfter.getDate() - 7);

    const results = await Promise.allSettled(
      SEARCH_QUERIES.map(async (query) => {
        const searchResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              q: query,
              type: 'video',
              order: 'date',
              maxResults: 10,
              publishedAfter: publishedAfter.toISOString(),
              key: apiKey
            }
          }
        );

        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        if (!videoIds) return [];

        const statsResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos',
          {
            params: {
              part: 'statistics',
              id: videoIds,
              key: apiKey
            }
          }
        );

        const statsMap = {};
        statsResponse.data.items.forEach(item => {
          statsMap[item.id] = item.statistics;
        });

        return searchResponse.data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          image: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          source: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          views: parseInt(statsMap[item.id.videoId]?.viewCount || 0),
          type: 'youtube'
        }));
      })
    );

    const seen = new Set();
    const items = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 20);

    res.status(200).json({ items, source: 'youtube' });
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(200).json({ error: 'Failed to fetch YouTube videos', items: [] });
  }
}
