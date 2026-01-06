export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-64 w-full bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

