import { SUBMIT_COMPANY_URL, GITHUB_URL } from "../constants";

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`flex items-center justify-center gap-4 border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 ${className}`}
    >
      <button
        onClick={() => {
          const el = document.getElementById("about-modal");
          if (el) el.showPopover();
        }}
        className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        About
      </button>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <a
        href={SUBMIT_COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        Submit a Company
      </a>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        GitHub
      </a>

      {/* About popover */}
      <div
        id="about-modal"
        popover="auto"
        className="m-auto max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/30 dark:border-gray-700 dark:bg-gray-800"
      >
        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          About Wazafak
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Wazafak is an interactive map of companies in Lebanon, built to help
          job seekers discover opportunities across industries. Browse by
          industry, search for companies, and find your next career move.
        </p>
        <button
          onClick={() => {
            const el = document.getElementById("about-modal");
            if (el) el.hidePopover();
          }}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </footer>
  );
}
