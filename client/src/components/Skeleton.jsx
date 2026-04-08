import './Skeleton.css'

export const Skeleton = ({ width, height, borderRadius, className = '' }) => {
  return (
    <div 
      className={`skeleton-box ${className}`} 
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius || ''
      }} 
    />
  )
}

export const SkeletonPulse = ({ children, loading, fallback }) => {
  if (loading) return fallback
  return children
}
