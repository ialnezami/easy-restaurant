export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

