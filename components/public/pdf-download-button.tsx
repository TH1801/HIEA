/** Conditional PDF download button — only renders if attachment_url exists */
export default function PdfDownloadButton({
  attachmentUrl,
}: {
  attachmentUrl: string | null;
}) {
  if (!attachmentUrl) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg border-2 border-dashed border-border bg-surface p-4">
      {/* PDF icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* File info */}
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-foreground">
          Tài liệu đính kèm
        </span>
        <span className="text-xs text-muted">PDF</span>
      </div>

      {/* Download button */}
      <a
        href={attachmentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Tải PDF
      </a>
    </div>
  );
}
