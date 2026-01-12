import { useState, useEffect, useMemo } from 'react';
import Header from './components/Layout/Header';
import TrendingToday from './components/TrendingToday';
import NewsFeed from './components/NewsFeed';
import RedditBuzz from './components/RedditBuzz';
import YouTubeCoverage from './components/YouTubeCoverage';
import NewAITools from './components/NewAITools';
import TwitterBuzz from './components/TwitterBuzz';
import SavedIdeas from './components/SavedIdeas';
import { useSavedItems } from './hooks/useSavedItems';
import { fetchAllData } from './services/api';

// AI entities to track for trending
const AI_ENTITIES = [
  'OpenAI', 'ChatGPT', 'GPT-4', 'GPT-5', 'Anthropic', 'Claude',
  'Google', 'Gemini', 'Bard', 'Meta', 'Llama', 'Microsoft', 'Copilot',
  'Midjourney', 'Stable Diffusion', 'DALL-E', 'Sora', 'Hugging Face',
  'xAI', 'Grok', 'Mistral', 'Perplexity', 'AI Agent', 'AGI'
];

function calculateTrending(allItems) {
  const counts = {};

  allItems.forEach(item => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();
    AI_ENTITIES.forEach(entity => {
      if (text.includes(entity.toLowerCase())) {
        counts[entity] = (counts[entity] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export default function App() {
  const [data, setData] = useState({
    news: { items: [] },
    rss: { items: [] },
    reddit: { items: [] },
    youtube: { items: [] },
    producthunt: { items: [] },
    twitter: { items: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { savedItems, savedIds, saveItem, removeItem } = useSavedItems();

  const loadData = async (fresh = false) => {
    setIsLoading(true);
    try {
      const result = await fetchAllData(fresh);
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  // Combine news and RSS for the news feed
  const newsFeedItems = useMemo(() => {
    const combined = [...data.news.items, ...data.rss.items];
    return combined.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [data.news.items, data.rss.items]);

  // Calculate trending from all items
  const allItems = useMemo(() => [
    ...data.news.items,
    ...data.rss.items,
    ...data.reddit.items,
    ...data.youtube.items,
    ...data.producthunt.items,
    ...data.twitter.items
  ], [data]);

  const trends = useMemo(() => calculateTrending(allItems), [allItems]);

  // Filter items by search query
  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.source?.toLowerCase().includes(query)
    );
  };

  const filteredNewsFeed = useMemo(() => filterItems(newsFeedItems), [newsFeedItems, searchQuery]);
  const filteredReddit = useMemo(() => filterItems(data.reddit.items), [data.reddit.items, searchQuery]);
  const filteredYouTube = useMemo(() => filterItems(data.youtube.items), [data.youtube.items, searchQuery]);
  const filteredProductHunt = useMemo(() => filterItems(data.producthunt.items), [data.producthunt.items, searchQuery]);
  const filteredTwitter = useMemo(() => filterItems(data.twitter.items), [data.twitter.items, searchQuery]);
  const filteredSaved = useMemo(() => filterItems(savedItems), [savedItems, searchQuery]);

  return (
    <div className="app">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="dashboard">
        <TrendingToday trends={trends} isLoading={isLoading} />

        <NewsFeed
          items={filteredNewsFeed}
          isLoading={isLoading}
          onSave={saveItem}
          savedIds={savedIds}
        />

        <RedditBuzz
          items={filteredReddit}
          isLoading={isLoading}
          onSave={saveItem}
          savedIds={savedIds}
        />

        <YouTubeCoverage
          items={filteredYouTube}
          isLoading={isLoading}
          onSave={saveItem}
          savedIds={savedIds}
        />

        <NewAITools
          items={filteredProductHunt}
          isLoading={isLoading}
          onSave={saveItem}
          savedIds={savedIds}
        />

        <TwitterBuzz
          items={filteredTwitter}
          isLoading={isLoading}
          onSave={saveItem}
          savedIds={savedIds}
        />

        <SavedIdeas
          items={filteredSaved}
          onRemove={removeItem}
        />
      </div>
    </div>
  );
}
