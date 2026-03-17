'use client';

export default function ListSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse"
        >
          <div className="flex justify-between items-center">
            {/* Left side */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>

            {/* Right side */}
            <div className="space-y-2 text-right">
              <div className="h-5 bg-gray-200 rounded w-20 ml-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-24 ml-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
