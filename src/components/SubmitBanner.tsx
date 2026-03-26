import { SUBMIT_COMPANY_URL } from "../constants";

/**
 * Inline banner shown at the bottom of the list view, encouraging submissions.
 */
export function SubmitBannerInline() {
  return (
    <div className="border-t border-gray-200 bg-blue-50 px-4 py-3 dark:border-gray-700 dark:bg-blue-950/30">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          Know a company that's missing?
        </span>
        <a
          href={SUBMIT_COMPANY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Submit it
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/**
 * Floating pill shown on the map view, bottom-left above footer.
 */
export function SubmitBannerFloating() {
  return (
    <a
      href={SUBMIT_COMPANY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-blue-600 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      Add a company
    </a>
  );
}
