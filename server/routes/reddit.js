import express from 'express';
import { cache } from '../cache.js';
import { fetchRedditPosts } from '../services/redditService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fresh = req.query.fresh === 'true';
    const cacheKey = 'reddit';

    if (!fresh && cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const data = await fetchRedditPosts();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Reddit API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Reddit posts', items: [] });
  }
});

export default router;
