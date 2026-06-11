export default function SkeletonCard() {
  return (
    <div className="p-5 border rounded-xl bg-white animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}