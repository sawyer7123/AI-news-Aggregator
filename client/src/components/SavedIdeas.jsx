import Section from './Layout/Section';
import Card from './Card';

export default function SavedIdeas({ items, onRemove }) {
  if (!items || items.length === 0) {
    return (
      <Section title="Saved Ideas" className="dashboard-full">
        <div className="empty-state">
          No saved items yet. Click the star on any item to save it for later.
        </div>
      </Section>
    );
  }

  return (
    <Section title="Saved Ideas" count={items.length} className="dashboard-full">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          onRemove={onRemove}
        />
      ))}
    </Section>
  );
}
