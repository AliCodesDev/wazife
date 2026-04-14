import { SUBMIT_COMPANY_URL } from "../constants";
import { ExternalLinkIcon, PlusCircleIcon } from "./Icon";

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
          <ExternalLinkIcon />
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
      <PlusCircleIcon />
      Add a company
    </a>
  );
}
