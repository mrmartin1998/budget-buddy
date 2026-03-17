'use client';

export default function CardSkeleton({ count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Progress bar or content area */}
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full w-full"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </>
  );
}
