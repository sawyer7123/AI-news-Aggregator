import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
});

export async function fetchNews(fresh = false) {
  const response = await api.get('/news', { params: { fresh } });
  return response.data;
}

export async function fetchRSS(fresh = false) {
  const response = await api.get('/rss', { params: { fresh } });
  return response.data;
}

export async function fetchReddit(fresh = false) {
  const response = await api.get('/reddit', { params: { fresh } });
  return response.data;
}

export async function fetchYouTube(fresh = false) {
  const response = await api.get('/youtube', { params: { fresh } });
  return response.data;
}

export async function fetchProductHunt(fresh = false) {
  const response = await api.get('/producthunt', { params: { fresh } });
  return response.data;
}

export async function fetchTwitter(fresh = false) {
  const response = await api.get('/twitter', { params: { fresh } });
  return response.data;
}

export async function fetchAllData(fresh = false) {
  const results = await Promise.allSettled([
    fetchNews(fresh),
    fetchRSS(fresh),
    fetchReddit(fresh),
    fetchYouTube(fresh),
    fetchProductHunt(fresh),
    fetchTwitter(fresh)
  ]);

  return {
    news: results[0].status === 'fulfilled' ? results[0].value : { items: [] },
    rss: results[1].status === 'fulfilled' ? results[1].value : { items: [] },
    reddit: results[2].status === 'fulfilled' ? results[2].value : { items: [] },
    youtube: results[3].status === 'fulfilled' ? results[3].value : { items: [] },
    producthunt: results[4].status === 'fulfilled' ? results[4].value : { items: [] },
    twitter: results[5].status === 'fulfilled' ? results[5].value : { items: [] }
  };
}
