import express from 'express';
import { cache } from '../cache.js';
import { fetchNews } from '../services/newsService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fresh = req.query.fresh === 'true';
    const cacheKey = 'news';

    if (!fresh && cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const data = await fetchNews();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news', items: [] });
  }
});

export default router;
