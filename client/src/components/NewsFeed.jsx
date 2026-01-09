import Section from './Layout/Section';
import Card from './Card';

export default function NewsFeed({ items, isLoading, onSave, savedIds }) {
  if (isLoading) {
    return (
      <Section title="News Feed">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Section title="News Feed">
        <div className="empty-state">No news articles found</div>
      </Section>
    );
  }

  return (
    <Section title="News Feed" count={items.length}>
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          onSave={onSave}
          isSaved={savedIds.has(item.id)}
        />
      ))}
    </Section>
  );
}
