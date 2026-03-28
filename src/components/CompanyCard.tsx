import { useEffect, useRef } from "react";
import type { Company } from "../types/company";
import { INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

interface CompanyCardProps {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyCard({ company, onClose }: CompanyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus the card when it opens, trap Tab inside
  useEffect(() => {
    if (!company || !cardRef.current) return;

    // Focus the card container
    cardRef.current.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !cardRef.current) return;

      const focusable = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [company]);

  // Close on Escape
  useEffect(() => {
    if (!company) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [company, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!company) return;

    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid closing from the same click that opened it
    const timer = setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleClick);
    };
  }, [company, onClose]);

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
        company ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!company}
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-label={company ? `Company details: ${company.name}` : undefined}
        className="pointer-events-auto w-full max-w-[500px] rounded-t-2xl bg-white p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] outline-none dark:bg-gray-800 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] max-sm:max-h-[60vh] max-sm:overflow-y-auto"
      >
        {company && (
          <>
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {company.name}
                </h2>
                {company.name_ar && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                    {company.name_ar}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close company details"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            {/* Industry tags + city */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {company.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: INDUSTRY_COLORS[ind] }}
                >
                  {INDUSTRY_LABELS[ind]}
                </span>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {company.city}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {company.description}
            </p>

            {/* Website link */}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1={10} y1={14} x2={21} y2={3} />
                </svg>
                Visit website
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
