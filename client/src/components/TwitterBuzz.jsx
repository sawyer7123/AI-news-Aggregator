import Section from './Layout/Section';
import Card from './Card';

export default function TwitterBuzz({ items, isLoading, onSave, savedIds }) {
  if (isLoading) {
    return (
      <Section title="X/Twitter Buzz">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Section title="X/Twitter Buzz">
        <div className="empty-state">No tweets found. Add TWITTER_BEARER_TOKEN to enable.</div>
      </Section>
    );
  }

  return (
    <Section title="X/Twitter Buzz" count={items.length}>
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
