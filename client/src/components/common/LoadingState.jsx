import "./States.css";

export const Skeleton = ({ width = "100%", height = 16, radius = 8, style }) => (
  <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton width={40} height={40} radius={12} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton width="60%" height={12} />
      <Skeleton width="35%" height={10} />
    </div>
    <Skeleton width={64} height={14} />
  </div>
);

const LoadingState = ({ fullScreen, label = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-fullscreen__mark font-display">F</div>
        <p>{label}</p>
      </div>
    );
  }
  return (
    <div className="skeleton-list">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default LoadingState;
