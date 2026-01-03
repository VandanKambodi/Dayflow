import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </Card>
  );
}

export function EmployeeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <EmployeeCardSkeleton key={i} />
      ))}
    </div>
  );
}
