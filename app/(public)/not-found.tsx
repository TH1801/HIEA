import Image from "next/image";
import Link from "next/link";

/**
 * 404 page for (public) route group — no header/footer since the (public) layout provides them.
 * Prevents double header/footer when notFound() is called from within (public) pages.
 */
export default function PublicNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-12 py-[120px] max-lg:px-6 max-lg:py-20 max-md:px-4 max-md:py-16">
      {/* 404 watermark */}
      <span className="select-none text-[200px] font-extrabold leading-none text-primary opacity-[0.08] max-md:text-[120px]">
        404
      </span>

      {/* Content stack — mt-6 spacing below watermark */}
      <div className="mt-6 flex flex-col items-center gap-6">
        <Image
          src="/logo-hiea.png"
          alt="HIEA Logo"
          width={128}
          height={128}
          className="rounded-lg"
        />

        <h2 className="text-[32px] font-bold text-foreground max-md:text-2xl">
          Không tìm thấy trang
        </h2>

        <p className="max-w-[480px] text-center text-base text-muted">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            Về Trang chủ
          </Link>
          <a
            href="mailto:info@hiea.org.vn"
            className="flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </div>
    </div>
  );
}
