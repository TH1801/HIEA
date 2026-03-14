import SkeletonHeroBanner from "@/components/public/skeleton-hero-banner";
import { SkeletonArticleGrid } from "@/components/public/skeleton-article-card";
import { SkeletonListGroup } from "@/components/public/skeleton-list-item";

/**
 * Loading state for public routes — shown during page transitions.
 * Combines hero + article grid + list skeletons to match homepage layout.
 */
export default function PublicLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <SkeletonHeroBanner />

      {/* Article grid skeleton — "Tin tức mới nhất" section */}
      <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-lg:py-10 max-md:px-4 max-md:py-8">
        <div className="flex flex-col gap-8">
          {/* Section heading shimmer */}
          <div className="flex animate-pulse items-center gap-3">
            <div className="h-7 w-1 rounded-sm bg-primary" />
            <div className="h-7 w-48 rounded-md bg-border" />
          </div>
          <SkeletonArticleGrid count={6} />
        </div>
      </div>

      {/* List skeleton — compact section */}
      <div className="bg-surface">
        <div className="mx-auto max-w-[1440px] px-12 py-12 max-lg:px-6 max-lg:py-10 max-md:px-4 max-md:py-8">
          <div className="flex flex-col gap-8">
            <div className="flex animate-pulse items-center gap-3">
              <div className="h-7 w-1 rounded-sm bg-primary" />
              <div className="h-7 w-36 rounded-md bg-border" />
            </div>
            <SkeletonListGroup count={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
