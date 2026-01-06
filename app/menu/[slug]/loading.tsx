export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative overflow-hidden">
        <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="h-12 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-16 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

