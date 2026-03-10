export default function CourseCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Thumbnail */}
      <div className="h-48 bg-gray-200" />

      {/* Body */}
      <div className="flex flex-col p-5 gap-3">
        <div className="h-3 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-4/5 bg-gray-200 rounded-full" />
        <div className="h-4 w-full bg-gray-100 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
        <div className="flex gap-4 pt-2 border-t border-gray-50">
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <div className="h-10 bg-violet-100 rounded-xl" />
      </div>
    </div>
  );
}
