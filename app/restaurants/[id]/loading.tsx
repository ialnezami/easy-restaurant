export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
          <div className="p-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

