import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ items: [], source: 'newsapi', message: 'NEWS_API_KEY not configured' });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'artificial intelligence OR AI OR machine learning OR ChatGPT OR GPT',
        sortBy: 'publishedAt',
        pageSize: 20,
        language: 'en',
        apiKey
      }
    });

    const items = response.data.articles.map(article => ({
      id: article.url,
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      source: article.source.name,
      publishedAt: article.publishedAt,
      type: 'news'
    }));

    res.status(200).json({ items, source: 'newsapi' });
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(200).json({ error: 'Failed to fetch news', items: [] });
  }
}
