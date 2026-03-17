'use client';

export default function StatCardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse"
        >
          {/* Icon placeholder */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>

          {/* Label */}
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>

          {/* Value */}
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>

          {/* Subtext */}
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}
