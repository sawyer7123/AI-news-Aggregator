import Section from './Layout/Section';

export default function TrendingToday({ trends, isLoading }) {
  if (isLoading) {
    return (
      <Section title="Trending Today" className="dashboard-full">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </Section>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <Section title="Trending Today" className="dashboard-full">
        <div className="empty-state">No trending topics found</div>
      </Section>
    );
  }

  return (
    <Section title="Trending Today" count={trends.length} className="dashboard-full">
      <div className="trending-grid">
        {trends.map((trend, index) => (
          <div key={index} className="trending-item">
            <div className="trending-topic">{trend.topic}</div>
            <div className="trending-count">{trend.count} mentions</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
