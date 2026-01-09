export default function Section({ title, count, children, className = '' }) {
  return (
    <section className={`section ${className}`}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {count !== undefined && (
          <span className="section-count">{count}</span>
        )}
      </div>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}
