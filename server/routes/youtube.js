import express from 'express';
import { cache } from '../cache.js';
import { fetchYouTubeVideos } from '../services/youtubeService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fresh = req.query.fresh === 'true';
    const cacheKey = 'youtube';

    if (!fresh && cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    const data = await fetchYouTubeVideos();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('YouTube API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube videos', items: [] });
  }
});

export default router;
