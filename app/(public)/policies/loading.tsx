import { SkeletonListGroup } from "@/components/public/skeleton-list-item";

/** Loading state for /policies route — page header shimmer + list skeleton */
export default function PoliciesLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div className="bg-hero-bg py-12 max-md:py-8">
        <div className="mx-auto max-w-[1440px] px-12 max-lg:px-6 max-md:px-4">
          <div className="animate-pulse">
            <div className="mb-4 h-4 w-48 rounded bg-border" />
            <div className="h-10 w-64 rounded-md bg-border" />
            <div className="mt-3 h-5 w-80 max-w-full rounded bg-border" />
          </div>
        </div>
      </div>

      {/* Policy list skeleton */}
      <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-md:px-4 max-md:py-8">
        <SkeletonListGroup count={6} />
      </div>
    </div>
  );
}
