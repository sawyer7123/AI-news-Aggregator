import express from 'express';
import { cache } from '../cache.js';
import { fetchProductHuntPosts } from '../services/producthuntService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fresh = req.query.fresh === 'true';
    const cacheKey = 'producthunt';

    if (!fresh && cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const data = await fetchProductHuntPosts();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Product Hunt API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Product Hunt posts', items: [] });
  }
});

export default router;
