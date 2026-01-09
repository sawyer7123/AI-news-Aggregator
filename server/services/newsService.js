import axios from 'axios';

export async function fetchNews() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.log('NEWS_API_KEY not set, returning empty results');
    return { items: [], source: 'newsapi' };
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

  return { items, source: 'newsapi' };
}
