import axios from 'axios';

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const clientId = process.env.PRODUCTHUNT_CLIENT_ID;
  const clientSecret = process.env.PRODUCTHUNT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log('Product Hunt: Missing credentials');
    return null;
  }

  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://api.producthunt.com/v2/oauth/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    console.log('Product Hunt: Token obtained successfully');
    return accessToken;
  } catch (error) {
    console.error('Product Hunt token error:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const token = await getAccessToken();

    if (!token) {
      return res.status(200).json({ items: [], source: 'producthunt', message: 'Product Hunt credentials not configured' });
    }

    // Query for recent posts, then filter for AI-related ones
    const query = `
      query {
        posts(first: 20) {
          edges {
            node {
              id
              name
              tagline
              url
              votesCount
              createdAt
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.producthunt.com/v2/api/graphql',
      { query },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.errors) {
      console.error('Product Hunt GraphQL errors:', JSON.stringify(response.data.errors));
      return res.status(200).json({ error: 'GraphQL error', items: [], details: response.data.errors });
    }

    // Filter for AI-related posts
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'llm', 'chatbot', 'neural', 'deep learning'];

    const allPosts = response.data.data.posts.edges.map(({ node }) => ({
      id: node.id,
      title: node.name,
      description: node.tagline,
      url: node.url,
      image: null,
      source: 'Product Hunt',
      publishedAt: node.createdAt,
      upvotes: node.votesCount,
      type: 'producthunt'
    }));

    // Filter for AI-related products
    const items = allPosts.filter(post => {
      const text = `${post.title} ${post.description}`.toLowerCase();
      return aiKeywords.some(keyword => text.includes(keyword));
    });

    console.log(`Product Hunt: Found ${items.length} AI-related posts out of ${allPosts.length} total`);
    res.status(200).json({ items, source: 'producthunt' });
  } catch (error) {
    console.error('Product Hunt API error:', error.response?.status, error.response?.data || error.message);
    res.status(200).json({
      error: 'Failed to fetch Product Hunt posts',
      items: [],
      debug: error.response?.data || error.message
    });
  }
}
