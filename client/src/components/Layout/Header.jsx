export default function Header({ lastUpdated, onRefresh, isLoading, searchQuery, onSearchChange }) {
  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="header">
      <div className="header-top">
        <h1>AI News Aggregator</h1>
        <div className="header-actions">
          <span className="last-updated">
            Last updated: {formatTime(lastUpdated)}
          </span>
          <button
            className="refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Filter across all sections..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </header>
  );
}
