interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export default function SkeletonLoader({
  className = '',
  lines = 3,
  showAvatar = false,
}: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-300 rounded ${
              i === lines - 1 ? 'w-5/6' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-200 flex items-center px-6">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

