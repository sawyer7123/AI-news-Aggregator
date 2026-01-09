import express from 'express';
import { cache } from '../cache.js';
import { fetchRSSFeeds } from '../services/rssService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fresh = req.query.fresh === 'true';
    const cacheKey = 'rss';

    if (!fresh && cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const data = await fetchRSSFeeds();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('RSS error:', error.message);
    res.status(500).json({ error: 'Failed to fetch RSS feeds', items: [] });
  }
});

export default router;
