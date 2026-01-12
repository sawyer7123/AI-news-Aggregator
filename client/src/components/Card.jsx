export default function Card({ item, onSave, onRemove, isSaved }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleClick = (e) => {
    if (e.target.closest('button')) return;
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const cardClass = `card ${item.type || ''}`;

  return (
    <div className={cardClass} onClick={handleClick}>
      {item.image && (
        <img
          src={item.image}
          alt=""
          className="card-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <div className="card-content">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta">
          <span className="card-source">{item.source}</span>
          <span>{formatDate(item.publishedAt)}</span>
          {item.type === 'reddit' && (
            <div className="card-stats">
              <span>{formatNumber(item.upvotes)} upvotes</span>
              <span>{formatNumber(item.comments)} comments</span>
            </div>
          )}
          {item.type === 'youtube' && (
            <div className="card-stats">
              <span>{formatNumber(item.views)} views</span>
            </div>
          )}
          {item.type === 'producthunt' && (
            <div className="card-stats">
              <span>{formatNumber(item.upvotes)} upvotes</span>
            </div>
          )}
          {item.type === 'twitter' && (
            <div className="card-stats">
              <span>{formatNumber(item.likes)} likes</span>
              <span>{formatNumber(item.retweets)} retweets</span>
            </div>
          )}
        </div>
      </div>
      <div className="card-actions">
        {onRemove ? (
          <button
            className="remove-btn"
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
            title="Remove from saved"
          >
            ×
          </button>
        ) : (
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSave(item); }}
            title={isSaved ? 'Saved' : 'Save for later'}
          >
            {isSaved ? '★' : '☆'}
          </button>
        )}
      </div>
    </div>
  );
}
