export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded" />

      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>

      <div className="h-60 bg-gray-200 rounded" />
    </div>
  );
}
