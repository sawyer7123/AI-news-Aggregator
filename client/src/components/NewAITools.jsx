import Section from './Layout/Section';
import Card from './Card';

export default function NewAITools({ items, isLoading, onSave, savedIds }) {
  if (isLoading) {
    return (
      <Section title="New AI Tools">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Section title="New AI Tools">
        <div className="empty-state">No Product Hunt launches found</div>
      </Section>
    );
  }

  return (
    <Section title="New AI Tools" count={items.length}>
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
