import axios from 'axios';

export default async function handler(req, res) {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      return res.status(200).json({
        items: [],
        source: 'twitter',
        message: 'TWITTER_BEARER_TOKEN not configured'
      });
    }

    // Search for recent tweets about AI from popular accounts and hashtags
    const query = '(AI OR "artificial intelligence" OR ChatGPT OR GPT-4 OR Claude OR Gemini) (news OR announcement OR launch OR update) -is:retweet lang:en';

    const response = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent',
      {
        params: {
          query: query,
          max_results: 20,
          'tweet.fields': 'created_at,public_metrics,author_id',
          'user.fields': 'name,username,profile_image_url',
          expansions: 'author_id'
        },
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        }
      }
    );

    const users = {};
    if (response.data.includes?.users) {
      response.data.includes.users.forEach(user => {
        users[user.id] = user;
      });
    }

    const items = (response.data.data || []).map(tweet => {
      const author = users[tweet.author_id] || {};
      return {
        id: tweet.id,
        title: tweet.text.substring(0, 200) + (tweet.text.length > 200 ? '...' : ''),
        description: tweet.text,
        url: `https://twitter.com/${author.username}/status/${tweet.id}`,
        image: author.profile_image_url,
        source: `@${author.username || 'unknown'}`,
        sourceName: author.name || 'Unknown',
        publishedAt: tweet.created_at,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        type: 'twitter'
      };
    });

    res.status(200).json({ items, source: 'twitter' });
  } catch (error) {
    console.error('Twitter API error:', error.response?.data || error.message);
    res.status(200).json({ error: 'Failed to fetch tweets', items: [] });
  }
}
