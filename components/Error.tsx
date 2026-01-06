interface ErrorProps {
  message?: string;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export default function Error({
  message = 'An error occurred',
  title,
  onDismiss,
  className = '',
}: ErrorProps) {
  return (
    <div
      className={`bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          {title && (
            <strong className="font-bold block mb-1">{title}</strong>
          )}
          <span className="block sm:inline">{message}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
            aria-label="Dismiss error"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}



