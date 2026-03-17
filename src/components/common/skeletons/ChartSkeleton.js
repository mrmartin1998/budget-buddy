'use client';

export default function ChartSkeleton({ bars = 3 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(bars)].map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gray-300 h-3 rounded-full"
              style={{ width: `${Math.random() * 60 + 40}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
