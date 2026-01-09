import Section from './Layout/Section';
import Card from './Card';

export default function RedditBuzz({ items, isLoading, onSave, savedIds }) {
  if (isLoading) {
    return (
      <Section title="Reddit Buzz">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Section title="Reddit Buzz">
        <div className="empty-state">No Reddit posts found</div>
      </Section>
    );
  }

  return (
    <Section title="Reddit Buzz" count={items.length}>
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
