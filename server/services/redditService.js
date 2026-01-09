import axios from 'axios';

const SUBREDDITS = ['artificial', 'MachineLearning', 'ChatGPT', 'LocalLLaMA'];

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'AI News Aggregator/1.0'
      }
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;

  return accessToken;
}

export async function fetchRedditPosts() {
  const token = await getAccessToken();

  if (!token) {
    console.log('Reddit credentials not set, returning empty results');
    return { items: [], source: 'reddit' };
  }

  const results = await Promise.allSettled(
    SUBREDDITS.map(async (subreddit) => {
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/hot`,
        {
          params: { limit: 10 },
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'AI News Aggregator/1.0'
          }
        }
      );

      return response.data.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
        url: `https://reddit.com${post.data.permalink}`,
        externalUrl: post.data.url,
        image: post.data.thumbnail !== 'self' && post.data.thumbnail !== 'default'
          ? post.data.thumbnail : null,
        source: `r/${subreddit}`,
        publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
        upvotes: post.data.ups,
        comments: post.data.num_comments,
        type: 'reddit'
      }));
    })
  );

  const items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 30);

  return { items, source: 'reddit' };
}
