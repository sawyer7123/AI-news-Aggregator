import Section from './Layout/Section';
import Card from './Card';

export default function YouTubeCoverage({ items, isLoading, onSave, savedIds }) {
  if (isLoading) {
    return (
      <Section title="YouTube Coverage">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Section title="YouTube Coverage">
        <div className="empty-state">No YouTube videos found</div>
      </Section>
    );
  }

  return (
    <Section title="YouTube Coverage" count={items.length}>
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
