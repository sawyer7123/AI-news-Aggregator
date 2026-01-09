import axios from 'axios';

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const clientId = process.env.PRODUCTHUNT_CLIENT_ID;
  const clientSecret = process.env.PRODUCTHUNT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

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

  return accessToken;
}

export async function fetchProductHuntPosts() {
  const token = await getAccessToken();

  if (!token) {
    console.log('Product Hunt credentials not set, returning empty results');
    return { items: [], source: 'producthunt' };
  }

  const query = `
    query {
      posts(first: 20, topic: "artificial-intelligence") {
        edges {
          node {
            id
            name
            tagline
            url
            votesCount
            thumbnail {
              url
            }
            createdAt
            topics {
              edges {
                node {
                  name
                }
              }
            }
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

  const items = response.data.data.posts.edges.map(({ node }) => ({
    id: node.id,
    title: node.name,
    description: node.tagline,
    url: node.url,
    image: node.thumbnail?.url,
    source: 'Product Hunt',
    publishedAt: node.createdAt,
    upvotes: node.votesCount,
    topics: node.topics.edges.map(t => t.node.name),
    type: 'producthunt'
  }));

  return { items, source: 'producthunt' };
}
