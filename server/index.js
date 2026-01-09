import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import newsRoutes from './routes/news.js';
import rssRoutes from './routes/rss.js';
import redditRoutes from './routes/reddit.js';
import youtubeRoutes from './routes/youtube.js';
import producthuntRoutes from './routes/producthunt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/rss', rssRoutes);
app.use('/api/reddit', redditRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/producthunt', producthuntRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
