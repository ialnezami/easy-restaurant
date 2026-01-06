interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({
  message = 'Loading...',
  fullScreen = true,
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-gray-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full border-blue-600 border-t-transparent mb-4 ${sizeClasses[size]}`}
          aria-hidden="true"
        ></div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}



