export default function SkeletonDetail() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="flex gap-4">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
      <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
    </div>
  );
}