export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

