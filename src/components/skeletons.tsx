import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-32 h-6" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-40 h-4" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-24 h-10" />
          ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-10" />
            </div>
          ))}
      </div>
    </div>
  );
}

export function EmployeeCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="w-16 h-16 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}

export function AttendanceSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b pb-4"
          >
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-6 rounded" />
          </div>
        ))}
    </div>
  );
}

export function TimeOffSkeleton() {
  return (
    <div className="space-y-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 space-y-2"
          >
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="w-16 h-6 rounded" />
              <Skeleton className="w-16 h-6 rounded" />
            </div>
          </div>
        ))}
    </div>
  );
}
