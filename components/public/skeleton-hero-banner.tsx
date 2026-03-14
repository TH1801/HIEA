/**
 * Skeleton loading state for HeroBanner component.
 * Matches Variant A from .pen design: full-width shimmer image + text lines.
 * All shimmer blocks use #E5E7EB (border color) with pulse animation.
 */
export default function SkeletonHeroBanner() {
  return (
    <section className="bg-hero-bg">
      <div className="mx-auto max-w-[1440px] px-12 py-16 max-lg:px-6 max-lg:py-10 max-md:px-4 max-md:py-8">
        <div role="status" aria-label="Đang tải nội dung" className="animate-pulse rounded-lg bg-surface p-8">
          {/* Image shimmer — 320px height */}
          <div className="h-[320px] w-full rounded-lg bg-border max-md:h-[200px]" />

          {/* Text shimmers */}
          <div className="mt-6 flex flex-col gap-6">
            <div className="h-8 w-[500px] max-w-full rounded-md bg-border" />
            <div className="h-5 w-[680px] max-w-full rounded-md bg-border" />
            <div className="h-11 w-[160px] rounded-md bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
